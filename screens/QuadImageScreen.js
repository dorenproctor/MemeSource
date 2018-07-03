import React from 'react';
import {
  View, Image, Dimensions, Text, Button, TouchableHighlight, StyleSheet
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import 'whatwg-fetch';
import Footer from '../components/Footer';


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
    if (this.state.currentNumber > 3) {
      this.setState(previousState => {
        return { currentNumber: previousState.currentNumber - 4 };
      });
    } else {
      this.setState({ currentNumber: 0 });
    }
  }

  // make sure not to go over the amount of images loaded in fetch
  onSwipeLeft(gestureState) {
    if (this.state.urls.length > this.state.currentNumber) {
      this.setState(previousState => {
        return { currentNumber: previousState.currentNumber + 4 };
      });
    }
  }

  componentDidMount() {
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/urls')
      .then((response) => {
        return response.json();
      }).then((json) => {
        this.setState({ urls: json.urls });
      }).catch(err => {
        console.log(err)
        alert("Could not fetch images :(");
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    const { currentNumber, urls } = this.state;

    if (urls == null) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading </Text>
        </View>
      )
    }

    const img0 = { uri: urls[currentNumber].url };
    const img1 = { uri: urls[currentNumber + 1].url };
    const img2 = { uri: urls[currentNumber + 2].url };
    const img3 = { uri: urls[currentNumber + 3].url };
    const styles = StyleSheet.create({
      img: {
        resizeMode: 'cover',
        backgroundColor: "darkgray",
        height: Dimensions.get('window').height / 2,
        width: Dimensions.get('window').width / 2,
      },
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
    });
    const gestureRecognizerConfig = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    const setCurrentNumber = (num) => {
      this.setState({ currentNumber: num });
    };

    const footerButtons = [
      {"title": "☰", "action": () => goBack(null)},
      {"title": " ", "action": () => null},
      {"title": "🔎", "action": () => null},
    ];

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
                navigate('SingleImage', { num: currentNumber, setCurrentNumber: setCurrentNumber, urls: urls })} >
                <Image
                  source={img0}
                  style={styles.img}
                />
              </TouchableHighlight>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableHighlight onPress={() =>
                  navigate('SingleImage', { num: currentNumber + 1, setCurrentNumber: setCurrentNumber, urls: urls })} >
                  <Image
                    source={img1}
                    style={styles.img} />
                </TouchableHighlight>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableHighlight onPress={() =>
                  navigate('SingleImage', { num: currentNumber + 2, setCurrentNumber: setCurrentNumber, urls: urls })} >
                  <Image
                    source={img2}
                    style={styles.img} />
                </TouchableHighlight>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <TouchableHighlight onPress={() =>
                    navigate('SingleImage', { num: currentNumber + 3, setCurrentNumber: setCurrentNumber, urls: urls })} >
                    <Image
                      source={img3}
                      style={styles.img} />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
          <Footer buttons={footerButtons}/>
        </GestureRecognizer>
    );
  }
}
