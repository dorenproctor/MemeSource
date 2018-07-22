import React from 'react'
import {
  View, Image, Dimensions, Text, AsyncStorage, TouchableHighlight, StyleSheet, Picker
} from 'react-native'
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
      currentNumber: 0,
      urls: null,
      user: "",
      sortBy: "newest"
    }
  }

  // 4 images load each screen, make sure not to use neg numbers
  onSwipeRight(gestureState) {
    if (this.state.currentNumber > 3) {
      this.setState(previousState => {
        AsyncStorage.setItem('currentNumber', JSON.stringify(previousState.currentNumber - 4))
        return { currentNumber: previousState.currentNumber - 4 }
      })
    } else {
      this.setState({ currentNumber: 0 })
    }
  }

  // make sure not to go over the amount of images loaded in fetch
  onSwipeLeft(gestureState) {
    if (this.state.urls.length-4 > this.state.currentNumber) {
      this.setState(previousState => {
        AsyncStorage.setItem('currentNumber', JSON.stringify(previousState.currentNumber + 4))
        return { currentNumber: previousState.currentNumber + 4 }
      })
    }
  }

  async getAsyncStorageData() {
    try {
      const keys = await AsyncStorage.multiGet(["currentNumber", "user"])
      const currentNumber = parseInt(keys[0][1])
      const user = keys[1][1]
      if (currentNumber)
        this.setState({currentNumber: currentNumber})
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
        sortBy: "newest",
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

  render() {
    const { navigate } = this.props.navigation
    const { currentNumber, urls, user } = this.state

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

    const setCurrentNumber = (num) => {
      this.setState({ currentNumber: num })
    }

    const setUser = (user) => {
      this.setState({ user: user })
    }

    const footerButtons = [
      {"title": "☰", "action": () => null},
      {"title": "Sign In", "action": () => navigate('SignIn', { num: currentNumber, setCurrentNumber: setCurrentNumber, setUser: setUser, urls: urls })},
      {"title": "🔎", "action": () => null},
    ]

    var num = currentNumber
    if (currentNumber > urls.length-4) {
      num = urls.length - 4
    }
    const img0 = { uri: urls[num].url }
    const img1 = { uri: urls[num + 1].url }
    const img2 = { uri: urls[num + 2].url }
    const img3 = { uri: urls[num + 3].url }

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
                navigate('SingleImage', { num: num, setCurrentNumber: setCurrentNumber, urls: urls, user: user })} >
                <Image
                  source={img0}
                  style={styles.img}
                />
              </TouchableHighlight>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableHighlight onPress={() =>
                  navigate('SingleImage', { num: num + 1, setCurrentNumber: setCurrentNumber, urls: urls, user: user })} >
                  <Image
                    source={img1}
                    style={styles.img} />
                </TouchableHighlight>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableHighlight onPress={() =>
                  navigate('SingleImage', { num: num + 2, setCurrentNumber: setCurrentNumber, urls: urls, user: user })} >
                  <Image
                    source={img2}
                    style={styles.img} />
                </TouchableHighlight>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <TouchableHighlight onPress={() =>
                    navigate('SingleImage', { num: num + 3, setCurrentNumber: setCurrentNumber, urls: urls, user: user })} >
                    <Image
                      source={img3}
                      style={styles.img} />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
          <Picker />
          <Footer buttons={footerButtons}/>
        </GestureRecognizer>
    )
  }
}
