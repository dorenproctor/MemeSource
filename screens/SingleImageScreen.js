import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
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
    const { goBack } = this.props.navigation;
    const { urls, currentNumber } = this.state;
    const onChange = (index) => {
      this.setState({ currentNumber: index})
    };

    const styles = StyleSheet.create({
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
    const action = () => null;

    const backButton = () => {
      goBack(null)
    }

    return (
      <Modal visible={true} transparent={true} onRequestClose={() => goBack(null)}>
        <ImageViewer imageUrls={urls} index={currentNumber} onChange={onChange} renderIndicator={() => null} />
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button title={"↶"} style={styles.btn} color={"#5c5c5c"} onPress={backButton} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title={"💬"} style={styles.btn} color={"#5c5c5c"} onPress={action} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title={"👎"} style={styles.btn} color={"#5c5c5c"} onPress={action} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title={"👍"} style={styles.btn} color={"#5c5c5c"} onPress={action} />
          </View>
        </View>
      </Modal>
    );
  }
}
