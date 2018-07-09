import React from 'react'
import { Modal } from 'react-native'
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
      user: this.props.navigation.state.params.user
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

  render() {
    const { goBack } = this.props.navigation
    const { urls, currentNumber, imageInfo } = this.state
    const { user } = this.props.navigation.state.params
    // alert(user)
    const onChange = (index) => {
      this.setState({ currentNumber: index}, () => this.getImageInfo() )
    }

    const downvoteString = this.getDownvoteString()
    const upvoteString = this.getUpvoteString()
    const footerButtons = [
      {"title": "↶", "action": () => goBack(null)},
      {"title": "💬", "action": () => null},
      {"title": downvoteString, "action": () => null},
      {"title": upvoteString, "action": () => null},
    ]

    return (
      <Modal visible={true} transparent={true} onRequestClose={() => goBack(null)}>
        <ImageViewer imageUrls={urls} index={currentNumber} onChange={onChange} renderIndicator={() => null} />
        <Footer buttons={footerButtons}/>
      </Modal>
    )
  }
}
