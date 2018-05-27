import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Text } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class SingleImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { 
      currentNumber: props.navigation.state.params.num, 
      setCurrentNumber: props.navigation.state.params.setCurrentNumber,
      urls: props.navigation.state.params.urls,
    };
  }

  componentWillUnmount() {
    this.state.setCurrentNumber(this.state.currentNumber);
  }

  render() {
    const img = this.state.currentImage;
    const { goBack } = this.props.navigation;
    const {urls, currentNumber } = this.state;
    const onChange = (index) => {
      this.setState(previousState => {
        return {currentNumber: index};
      })
    };

    return (
      <Modal visible={true} transparent={true} onRequestClose={() => goBack(null)}>
        <ImageViewer imageUrls={urls} index={currentNumber} onChange={onChange} />
      </Modal>
    );
  }
}
