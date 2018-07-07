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
    }
  }

  componentWillUnmount() {
    this.state.setCurrentNumber(this.state.currentNumber)
  }

  render() {
    const { goBack } = this.props.navigation
    const { urls, currentNumber } = this.state
    const { user } = this.props.navigation.state.params
    // alert(user)
    const onChange = (index) => {
      this.setState({ currentNumber: index})
    }

    const footerButtons = [
      {"title": "↶", "action": () => goBack(null)},
      {"title": "💬", "action": () => null},
      {"title": "👎", "action": () => null},
      {"title": "👍", "action": () => null},
    ]

    return (
      <Modal visible={true} transparent={true} onRequestClose={() => goBack(null)}>
        <ImageViewer imageUrls={urls} index={currentNumber} onChange={onChange} renderIndicator={() => null} />
        <Footer buttons={footerButtons}/>
      </Modal>
    )
  }
}
