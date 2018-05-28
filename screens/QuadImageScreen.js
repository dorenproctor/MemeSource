import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
  View, Image, Dimensions, Text, TouchableHighlight, StyleSheet
} from 'react-native';
import { createStackNavigator } from 'react-navigation'
import SingleImageScreen from '../screens/SingleImageScreen';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import 'whatwg-fetch'

export default class QuadImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { currentNumber: 0, urls: null };
  }

  // 4 images load each screen, make sure not to use neg numbers
  onSwipeRight(gestureState) {
    // alert(this.state.currentNumber)
    if (this.state.currentNumber > 3) {
      this.setState(previousState => {
          return { currentNumber: previousState.currentNumber-4 };
      });
    } else {
      this.setState(previousState => {
        return { currentNumber: 0 };
    });
    }
  }

  // make sure not to go over the amount of images loaded in fetch
  onSwipeLeft(gestureState) {
    // alert(this.state.currentNumber)
    if (this.state.urls.length > 3) {
      this.setState(previousState => {
          return { currentNumber: previousState.currentNumber+4 };
      });
    }
  }

  componentDidMount() {
    // This is in QuadImageScreen to pass to SingleImageScreen
    // so that it is already loaded when its render happens.
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/urls')
    .then((response) => {
      console.log("Response: ", response);
      return response.json();
    }).then((json) => {
      console.log("json: ", json);
      this.setState(previousState => {
        return { urls: json.urls };
      });
    });
  }

  render() {
    const stackNavigator = createStackNavigator ({
      SingleImage: {
        screen: SingleImageScreen,
      }
    })
    const { navigate } = this.props.navigation;
    const img0 = { uri: 'http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/'+this.state.currentNumber };
    const img1 = { uri: 'http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/'+(this.state.currentNumber+1) };
    const img2 = { uri: 'http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/'+(this.state.currentNumber+2) };
    const img3 = { uri: 'http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/'+(this.state.currentNumber+3) };
    const styles = StyleSheet.create({
      img: {
        resizeMode: 'stretch',
        backgroundColor: "darkgray",
        height: Dimensions.get('window').height / 2,
        width: Dimensions.get('window').width / 2,
      },
    });
    const gestureRecognizerConfig = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    const setCurrentNumber = (num) => {
      this.setState({currentNumber: num});
    };

    const { currentNumber, urls } = this.state;

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
            navigate('SingleImage', { num: currentNumber, setCurrentNumber: setCurrentNumber, urls: urls }) } >
              <Image
                source={ img0 }
                style={ styles.img }
               />
            </TouchableHighlight>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableHighlight onPress={() =>
                navigate('SingleImage', { num: currentNumber+1, setCurrentNumber: setCurrentNumber, urls: urls }) } >
                  <Image
                source={ img1 }
                style={ styles.img } />
              </TouchableHighlight>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableHighlight onPress={() =>
              navigate('SingleImage', { num: currentNumber+2, setCurrentNumber: setCurrentNumber, urls: urls }) } >
                <Image
                  source={ img2 }
                  style={ styles.img } />
              </TouchableHighlight>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <TouchableHighlight onPress={() =>
                  navigate('SingleImage', { num: currentNumber+3, setCurrentNumber: setCurrentNumber, urls: urls }) } >
                    <Image
                      source={ img3 }
                      style={ styles.img } />
                  </TouchableHighlight>
                </View>
            </View>
          </View>
        </View>
      </GestureRecognizer>
    );
  }
}
