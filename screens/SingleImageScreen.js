import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { View, Button, StyleSheet, Dimensions } from 'react-native';
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

    const styles = StyleSheet.create({
      btn: {
        // height: 50,
        width: Dimensions.get('window').width / 5,
      },
      container: {
        flex: 1, // probably?
        flexDirection: "row",
      },
      text: {
        color: "white",
      }
    });
    const action = () => null;

    const backButton = () => {
      goBack(null)
    }

    return (
        <Modal visible={true} transparent={true} onRequestClose={() => goBack(null)}>
          <ImageViewer imageUrls={urls} index={currentNumber} onChange={onChange} renderIndicator={()=>null}/>
          <View style={styles.div}>
            <Button title={"back"} style={styles.btn} onPress={backButton} color={"blue"} />
            <Button title={"upvote"} style={styles.btn} onPress={action} color={"blue"} />
            <Button title={"comments"} style={styles.btn} onPress={action} color={"blue"} />
            <Button title={"downvote"} style={styles.btn} onPress={action} color={"blue"} />
            <Button title={"menu"} style={styles.btn} onPress={action} color={"blue"} />
          </View>
        </Modal>
    );
  }
}
