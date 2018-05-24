import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Image } from 'react-native';
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
      currentImage: props.navigation.state.params.img,
      setCurrentNumber: props.navigation.state.params.setCurrentNumber,
    };
  }

  onSwipeRight(gestureState) {
    const newNumber = this.state.currentNumber-1;
    if (newNumber >= 0) {
      const img = { uri: 'http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/'+ newNumber };
      this.setState(previousState => {
        return { 
          currentNumber: newNumber, 
          currentImage: img,
        };
    });
    }
  }

  onSwipeLeft(gestureState) {
    const newNumber = this.state.currentNumber+1;
    const img = { uri: 'http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/'+ newNumber };
    this.setState(previousState => {
        return { 
          currentNumber: newNumber, 
          currentImage: img,
        };
    });
  }

  componentWillUnmount() {
    this.state.setCurrentNumber(this.state.currentNumber);
  }

  render() {
    const img = this.state.currentImage;
    const { goBack } = this.props.navigation;
    return (
      <Modal visible={true} transparent={true} onRequestClose={() => goBack(null)}>
        <ImageViewer imageUrls={[{url: img.uri}]}/>
      </Modal>
    );
  }
}

    // const gestureRecognizerConfig = {
    //   velocityThreshold: 0.3,
    //   directionalOffsetThreshold: 80
    // };

/*
      <GestureRecognizer
      onSwipeRight={(state) => this.onSwipeRight(state)}
      onSwipeLeft={(state) => this.onSwipeLeft(state)}
      config={gestureRecognizerConfig}
      style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
      }}>
        <Image source={img} style={{flex:1, height: undefined, width: undefined, resizeMode:"contain", backgroundColor: "black" }} />
      </GestureRecognizer>
*/