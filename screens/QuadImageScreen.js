import React from 'react'
import {
  View, Image, Dimensions, Text, AsyncStorage, TouchableHighlight, StyleSheet, Picker
} from 'react-native'
import ModalSelector from 'react-native-modal-selector'

import GestureRecognizer from 'react-native-swipe-gestures'
import 'whatwg-fetch'
import Footer from '../components/Footer'


export default class QuadImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
      currentId: 0,
      imageIds: [],
      urls: null,
      user: "",
      sortBy: "newest",
      selector: false,
    }
    this.updatePosition = this.updatePosition.bind(this)
    this.setUser = this.setUser.bind(this)

  }

  onSwipeRight(gestureState) {
    const {currentIndex, imageIds } = this.state
    if (this.state.currentIndex > 3) {
      // AsyncStorage.setItem('currentId', JSON.stringify(currentIndex - 4))
      AsyncStorage.multiSet([['currentIndex', (currentIndex-4).toString()], ['currentId', imageIds[currentIndex-4].toString()]])
      this.setState({ currentIndex: currentIndex-4, currentId: imageIds[currentIndex] })
    } else {
      AsyncStorage.multiSet([['currentIndex', "0"], ['currentId', imageIds[0].toString()]])
      this.setState({ currentIndex: 0, currentId: imageIds[0] })
    }
  }

  onSwipeLeft(gestureState) {
    const {currentIndex, imageIds } = this.state
    if (imageIds.length-4 > this.state.currentIndex) {
      AsyncStorage.multiSet([['currentIndex', (currentIndex+4).toString()], ['currentId', imageIds[currentIndex+4].toString()]])

      this.setState({ currentIndex: currentIndex+4, currentId: imageIds[currentIndex] })
    } else {
      const last = imageIds.length-1
      AsyncStorage.multiSet([['currentIndex', (last).toString()], ['currentId', imageIds[last].toString()]])
      this.setState({ currentIndex: last, currentId: imageIds[last] })
    }
  }

  async getAsyncStorageData() {
    try {
      const keys = await AsyncStorage.multiGet(["currentId", "user", "imageIds", "sortBy"])
      const currentId = parseInt(keys[0][1])
      const user = keys[1][1]
      const imageIds = JSON.parse(keys[2][1])
      const sortBy = keys[3][1]
      if (currentId && imageIds) {
        const currentIndex = imageIds.findIndex((x) => {return x==currentId})
        if (currentIndex > -1) {
          this.setState({imageIds: imageIds, currentId: currentId, currentIndex: currentIndex})
        }
      }
      if (user)
        this.setState({user: user})
      if (sortBy) {
        this.setState({sortBy: sortBy})
      }
    } catch(error) {
      alert(error)
    }
  }

  getImages() {
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/imageSearch', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sortBy: this.state.sortBy,
      })
    }).then((response) => { return response.json() })
    .then((json) => {
      var urls = json.content.map(id => {
        var newObj = {}
        var string = "http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/" + id
        newObj["url"] = string
        return newObj
      })
      this.setState({ urls: urls, imageIds: json.content, currentId: json.content[0] })
      AsyncStorage.multiSet([['imageIds', JSON.stringify(json.content)], ['currentId', json.content[0].toString()]])
    }).catch(err => {
      console.log(err)
      alert("Could not fetch images :(")
    })
  }
  
  componentDidMount() {
    this.getAsyncStorageData()
    .then(() => {
      if (!this.state.urls) {
        this.getImages()
      }
    })
  }

  updatePosition(index, id) {
    this.setState({ currentIndex: index, currentId: id })
  }

  setUser(user) {
    this.setState({ user: user })
  }

  openSingleImage(num) {
    const { navigate } = this.props.navigation
    const { urls, imageIds, user } = this.state
    // AsyncStorage.multiSet([['imageIds', JSON.stringify(imageIds)], ['currentId', imageIds[0].toString()]])
    navigate('SingleImage', { currentIndex: num, currentId: imageIds[num], imageIds: imageIds, urls: urls, user: user, updatePosition: this.updatePosition })
  }
  
  updateSorting(option) {
    // const oldSortBy = this.state.sortBy
    // if (oldSortBy !== option.label) {
    // }
    this.setState({sortBy: option.label, selector: false, currentIndex: 0 }, () => { 
      this.getImages()
    })
    AsyncStorage.setItem('sortBy', option.label)
  }

  render() {
    const { navigate } = this.props.navigation
    const { currentIndex, urls, user, selector, sortBy } = this.state

    if (urls == null) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading </Text>
        </View>
      )
    }

    const styles = StyleSheet.create({
      img: {
        resizeMode: 'cover',
        backgroundColor: "darkgray",
        height: Dimensions.get('window').height / 2,
        width: Dimensions.get('window').width / 2,
      },
    })
    
    const gestureRecognizerConfig = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    }

    const userString = user ? user : "Sign In"

    const footerButtons = [
      {"title": "☰", "action": () => null},
      {"title": userString, "action": () => navigate('SignIn', { num: currentIndex, setUser: this.setUser, urls: urls })},
      {"title": sortBy, "action": () => this.setState({selector: true})},
      {"title": "🔎", "action": () => null},
    ]

    var num = currentIndex
    if (currentIndex > urls.length-4) {
      num = urls.length - 4
    }
    // console.log(num)
    const img0 = {  uri: urls[num].url }
    const img1 = { uri: urls[num + 1].url }
    const img2 = { uri: urls[num + 2].url }
    const img3 = { uri: urls[num + 3].url }

    var dataKey = 0
    const data = [
        { key: dataKey++, section: true, label: 'Sort By' },
        { key: dataKey++, label: 'newest' },
        { key: dataKey++, label: 'oldest' },
        { key: dataKey++, label: 'upvotes', },
    ]


    return (
        <GestureRecognizer
          onSwipeRight={(state) => this.onSwipeRight(state)}
          onSwipeLeft={(state) => this.onSwipeLeft(state)}
          config={gestureRecognizerConfig}
          style={{
            flex: 1,
            backgroundColor: this.state.backgroundColor
          }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableHighlight onPress={() => {this.openSingleImage(num)}} >
                <Image
                  source={img0}
                  style={styles.img}
                />
              </TouchableHighlight>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableHighlight onPress={() => {this.openSingleImage(num+1)}} >
                  <Image
                    source={img1}
                    style={styles.img} />
                </TouchableHighlight>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableHighlight onPress={() => {this.openSingleImage(num+2)}} >
                  <Image
                    source={img2}
                    style={styles.img} />
                </TouchableHighlight>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <TouchableHighlight onPress={() => {this.openSingleImage(num+3)}} >
                    <Image
                      source={img3}
                      style={styles.img} />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
          <ModalSelector
            data={data}
            initValue="Select something yummy!"
            visible={selector}
            onChange={(option)=>{ this.updateSorting(option) }} />
          <Footer buttons={footerButtons}/>
        </GestureRecognizer>
    )
  }
}
