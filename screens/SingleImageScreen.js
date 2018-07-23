import React from 'react'
import { Modal, StyleSheet, AsyncStorage } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import Footer from '../components/Footer'
import ModalSelector from 'react-native-modal-selector'

export default class SingleImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: props.navigation.state.params.currentIndex,
      currentId: props.navigation.state.params.currentId,
      imageIds: props.navigation.state.params.imageIds,
      urls: props.navigation.state.params.urls,
      user: props.navigation.state.params.user,
      updatePosition: props.navigation.state.params.updatePosition,
      imageInfo: null,
      modalOn: true,
      selector: false,
    }
  }

  getImageInfo() {
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/imageInfo/'+this.state.currentId)
    .then((response) => {
      return response.json()
    }).then((json) => {
        this.setState({ imageInfo: json.content })
    }).catch(err => {
      console.log(err)
      alert("Could not fetch image data")
    })
  }

  componentWillUnmount() {
    const {updatePosition, currentIndex, currentId} = this.state
    updatePosition(currentIndex, currentId)
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
    const { user, currentId } = this.state
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
        imageId: currentId,
      })
    }).then((response) => { return response.json() })
      .then((response) => {
        if (response.statusCode == 200) {
          this.setState({ imageInfo: response.content })
        } else (
          alert(response.message)
        )
    })
  }

  downvote() {
    const { user, currentId } = this.state
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
        imageId: currentId,
      })
    }).then((response) => { return response.json() })
      .then((response) => {
        if (response.statusCode == 200) {
          this.setState({ imageInfo: response.content })
        } else (
          alert(response.message)
        )
    })
  }

  hamburgerMenu(option) {
    switch(option.label) {
      case "Image Info":
        alert(JSON.stringify(this.state.imageInfo))
        // this.setState({selector: false})
        break
    }
  }

  render() {
    const { goBack } = this.props.navigation
    const { urls, imageIds, currentIndex, currentId, modalOn, selector } = this.state
    const { user } = this.props.navigation.state.params
    const { navigate } = this.props.navigation

    const onChange = (index) => {
      this.setState({ currentIndex: index, currentId: imageIds[index] }, () => {
        this.getImageInfo()
      })
      AsyncStorage.multiSet([['currentIndex', index.toString()], ['currentId', imageIds[index].toString()]])
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
        navigate('Comment', { num: currentId, user: user, turnModalOn: turnModalOn })}
      },
      {"title": downvoteString, "action": () => this.downvote()},
      {"title": upvoteString, "action": () => this.upvote()},
      {"title": "☰", "action": () => this.setState({selector: true})},
    ]

    // Without the custom style, half the footer is below the screen
    // because position: absolute doesn't work inside the modal
    const customFooterStyle = StyleSheet.create({
      btn: {
        height: "100%",
      },
      container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        backgroundColor: "black",
  
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: "darkgrey",
      },
      buttonContainer: {
        flex: 1,
      },
      modalSelector: {
        display: "none",
      }
    })

    var dataKey = 0
    const data = [
        { key: dataKey++, label: "Image Info" },
    ]

    return (
      <Modal visible={modalOn} transparent={true} onRequestClose={() => goBack(null)}>
        <ImageViewer imageUrls={urls} index={currentIndex} onChange={onChange} renderIndicator={() => null} />
        <ModalSelector
          data={data}
          visible={selector}
          onModalClose={() => this.setState({selector: false})}
          touchableStyle={customFooterStyle.modalSelector}
          onChange={(option)=>{ this.hamburgerMenu(option) }} />
        <Footer buttons={footerButtons} customStyle={customFooterStyle} />
      </Modal>
    )
  }
}