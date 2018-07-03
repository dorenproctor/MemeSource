import React from 'react';
import { KeyboardAvoidingView, TextInput, Text, View, Button, StyleSheet } from 'react-native';
import Footer from '../components/Footer';

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
      userText: "",
      emailText: "",
      passwordText: "",
    };
  }

  componentWillUnmount() {
    this.state.setCurrentNumber(this.state.currentNumber);
  }

  render() {
    const { goBack } = this.props.navigation;
    const { urls, currentNumber, userText, emailText, passwordText, } = this.state;
    const onChange = (index) => {
      this.setState({ currentNumber: index})
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
      },
      input: {
        // flex: 1,
        height: 75,
      },
      label: {
        height: 50,
      },
      btn: {
        
      },
    });
    const action = () => null;

    const backButton = () => {
      goBack(null)
    }

    const footerButtons = [
      {"title": "↶", "action": () => goBack(null)},
      {"title": " ", "action": () => null},
      {"title": " ", "action": () => null},
      {"title": " ", "action": () => null},
    ];

    return (
      <View style={styles.container}>
        <Text>Username</Text>
        <TextInput
          editable={true}
          onChangeText={(text) => this.setState({userText: text})}
          style={styles.input}
          />
        <Text>Email</Text>
        <TextInput
          editable={true}
          onChangeText={(text) => this.setState({emailText: text})}
          style={styles.input}
          />
        <Text>Password</Text>
        <TextInput
          editable={true}
          onChangeText={(text) => this.setState({passwordText: text})}
          style={styles.input}
          />
        <Text>{userText}{emailText}{passwordText}</Text>
        <Button title={"Sign In"} onPress={null} style={styles.btn} />
        <Button title={"Create Account"} onPress={null} style={styles.btn} />
        <Footer buttons={footerButtons} />
      </View>
    );
  }
}
