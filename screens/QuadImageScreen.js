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
      urls: null,
      user: "",
      sortBy: "newest",
      selector: false,
    }
  }

  // 4 images load each screen, make sure not to use neg numbers
  onSwipeRight(gestureState) {
    if (this.state.currentIndex > 3) {
      this.setState(previousState => {
        AsyncStorage.setItem('currentIndex', JSON.stringify(previousState.currentIndex - 4))
        return { currentIndex: previousState.currentIndex - 4 }
      })
    } else {
      this.setState({ currentIndex: 0 })
    }
  }

  // make sure not to go over the amount of images loaded in fetch
  onSwipeLeft(gestureState) {
    if (this.state.urls.length-4 > this.state.currentIndex) {
      this.setState(previousState => {
        AsyncStorage.setItem('currentIndex', JSON.stringify(previousState.currentIndex + 4))
        return { currentIndex: previousState.currentIndex + 4 }
      })
    }
  }

  async getAsyncStorageData() {
    try {
      const keys = await AsyncStorage.multiGet(["currentIndex", "user"])
      const currentIndex = parseInt(keys[0][1])
      const user = keys[1][1]
      if (currentIndex)
        this.setState({currentIndex: currentIndex})
      if (user)
        this.setState({user: user})
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
      this.setState({ urls: urls })
    }).catch(err => {
      console.log(err)
      alert("Could not fetch images :(")
    })
  }
  
  componentDidMount() {
    this.getImages()
    this.getAsyncStorageData()
  }

  updateSorting(option) {
    const oldSortBy = this.state.sortBy
    if (oldSortBy !== option.label) {
      this.setState({sortBy: option.label, selector: false, currentIndex: 0 }, () => { 
        this.getImages()
      })
    }
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

    const setcurrentIndex = (num) => {
      this.setState({ currentIndex: num })
    }

    const setUser = (user) => {
      this.setState({ user: user })
    }

    const footerButtons = [
      {"title": "☰", "action": () => null},
      {"title": "Sign In", "action": () => navigate('SignIn', { num: currentIndex, setcurrentIndex: setcurrentIndex, setUser: setUser, urls: urls })},
      {"title": sortBy, "action": () => this.setState({selector: true})},
      {"title": "🔎", "action": () => null},
    ]

    var num = currentIndex
    if (currentIndex > urls.length-4) {
      num = urls.length - 4
    }
    const img0 = { uri: urls[num].url }
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
              <TouchableHighlight onPress={() =>
                navigate('SingleImage', { num: num, setcurrentIndex: setcurrentIndex, urls: urls, user: user })} >
                <Image
                  source={img0}
                  style={styles.img}
                />
              </TouchableHighlight>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableHighlight onPress={() =>
                  navigate('SingleImage', { num: num + 1, setcurrentIndex: setcurrentIndex, urls: urls, user: user })} >
                  <Image
                    source={img1}
                    style={styles.img} />
                </TouchableHighlight>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableHighlight onPress={() =>
                  navigate('SingleImage', { num: num + 2, setcurrentIndex: setcurrentIndex, urls: urls, user: user })} >
                  <Image
                    source={img2}
                    style={styles.img} />
                </TouchableHighlight>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <TouchableHighlight onPress={() =>
                    navigate('SingleImage', { num: num + 3, setcurrentIndex: setcurrentIndex, urls: urls, user: user })} >
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
