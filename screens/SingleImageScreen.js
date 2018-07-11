import React from 'react'
import { Modal, StyleSheet } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import Footer from '../components/Footer'

export default class SingleImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      currentNumber: props.navigation.state.params.num,
      setCurrentNumber: props.navigation.state.params.setCurrentNumber,
      urls: props.navigation.state.params.urls,
      imageInfo: null,
      user: this.props.navigation.state.params.user,
      modalOn: true,
    }
  }

  getImageInfo() {
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/imageInfo/'+this.state.currentNumber)
    .then((response) => {
      return response.json()
    }).then((json) => {
        this.setState({ imageInfo: json.content })
      // alert(JSON.stringify(json.content))
    }).catch(err => {
      console.log(err)
      alert("Could not fetch image data")
    })
  }

  componentWillUnmount() {
    this.state.setCurrentNumber(this.state.currentNumber)
  }

  componentDidMount() {
    this.getImageInfo()
  }

  getUpvoteString() {
    const { imageInfo, user } = this.state
    var string = "👍🏻"
    if (!imageInfo)
      return string
    if (imageInfo.upvoters.indexOf(user) > -1) { //contains user
      string = "👍"
    }
    return string += imageInfo.upvotes
  }

  getDownvoteString() {
    const { imageInfo, user } = this.state
    var string = "👎🏻"
    if (!imageInfo)
      return string
    if (imageInfo.downvoters.indexOf(user) > -1) { //contains user
      string = "👎"
    }
    return string += imageInfo.downvotes
  }

  upvote() {
    const { user, currentNumber } = this.state
    if (!user) {
      alert("You must be signed in to vote")
      return
    }
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/upvoteImage', { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user,
        imageId: currentNumber,
      })
    }).then((response) => { return response.json() })
      .then((response) => {
        if (response.statusCode == 200) {
          // alert(JSON.stringify(response.content))
          this.setState({ imageInfo: response.content })
        } else (
          alert(response.message)
        )
    })
  }

  downvote() {
    const { user, currentNumber } = this.state
    if (!user) {
      alert("You must be signed in to vote")
      return
    }
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/downvoteImage', { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user,
        imageId: currentNumber,
      })
    }).then((response) => { return response.json() })
      .then((response) => {
        if (response.statusCode == 200) {
          // alert(JSON.stringify(response.content))
          this.setState({ imageInfo: response.content })
        } else (
          alert(response.message)
        )
    })
  }

  render() {
    const { goBack } = this.props.navigation
    const { urls, currentNumber, modalOn } = this.state
    const { user } = this.props.navigation.state.params
    const { navigate } = this.props.navigation
    // alert(user)
    const onChange = (index) => {
      this.setState({ currentNumber: index}, () => this.getImageInfo() )
    }

    const downvoteString = this.getDownvoteString()
    const upvoteString = this.getUpvoteString()
    const turnModalOn = (num) => {
      this.setState({ modalOn: true })
    }

    const footerButtons = [
      {"title": "↶", "action": () => goBack(null)},
      {"title": "💬", "action": () => {
        this.setState({ modalOn: false })
        navigate('Comment', { num: currentNumber, user: user, turnModalOn: turnModalOn })}
      },
      {"title": downvoteString, "action": () => this.downvote()},
      {"title": upvoteString, "action": () => this.upvote()},
    ]

    // Without the custom style, half the footer is below the screen
    // because position: absolute doesn't work inside the modal
    const customFooterStyle = StyleSheet.create({
      btn: {
        height: "100%",
      },
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: 'black',
  
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: 'darkgrey',
      },
      buttonContainer: {
        flex: 1,
      }
    })

    return (
      <Modal visible={modalOn} transparent={true} onRequestClose={() => goBack(null)}>
        <ImageViewer imageUrls={urls} index={currentNumber} onChange={onChange} renderIndicator={() => null} />
        <Footer buttons={footerButtons} customStyle={customFooterStyle} />
      </Modal>
    )
  }
}