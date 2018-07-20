import React from 'react'
import { AsyncStorage, TextInput, Text, View, Button, StyleSheet } from 'react-native'
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
      setUser: props.navigation.state.params.setUser,
      urls: props.navigation.state.params.urls,
      userText: "",
      emailText: "",
      passwordText: "",
      user: "",
    }
    this.signIn = this.signIn.bind(this)
    this.createUser = this.createUser.bind(this)
  }

  componentWillUnmount() {
    this.state.setCurrentNumber(this.state.currentNumber)
    this.state.setUser(this.state.user)
  }

  signIn() {
    const { userText, passwordText } = this.state

    if (!userText || !passwordText) {
      alert("Username and password both required")
      return
    }
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/signIn', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: userText,
        password: passwordText,
      })
    }).then((response) => { return response.json() })
      .then((response) => {
      alert(response.message)
      if (response.statusCode == 200) {
        this.setState({ user: userText })
        AsyncStorage.setItem('user', userText)
        const { goBack } = this.props.navigation
        goBack(null)
      }
    })
  }

  createUser() {
    const { userText, emailText, passwordText, username } = this.state

    if (!userText || !emailText || !passwordText) {
      alert("Username, email, and password are all required")
      return
    }
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/createUser', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: userText,
        email: emailText,
        password: passwordText,
      })
    }).then((response) => { return response.json() })
      .then((response) => {
      alert(response.message)
      if (response.statusCode == 200) {
        this.setState({ user: username })
        AsyncStorage.setItem('user', userText)
        const { goBack } = this.props.navigation
        goBack(null)
      }
    })
  }

  render() {
    const { goBack } = this.props.navigation
    const { urls, currentNumber, userText, emailText, passwordText, } = this.state
    const onChange = (index) => {
      this.setState({ currentNumber: index})
    }

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
    })
    const action = () => null

    const backButton = () => {
      goBack(null)
    }

    const footerButtons = [
      {"title": "↶", "action": () => goBack(null)},
      {"title": " ", "action": () => null},
      {"title": " ", "action": () => null},
      {"title": " ", "action": () => null},
    ]

    return (
      <View style={styles.container}>
        <Text>Username</Text>
        <TextInput
          editable={true}
          onChangeText={(text) => this.setState({userText: text})}
          style={styles.input}
          autoCapitalize={"none"}
          />
        <Text>Email</Text>
        <TextInput
          editable={true}
          onChangeText={(text) => this.setState({emailText: text})}
          style={styles.input}
          autoCapitalize={"none"}
          />
        <Text>Password</Text>
        <TextInput
          editable={true}
          onChangeText={(text) => this.setState({passwordText: text})}
          style={styles.input}
          autoCapitalize={"none"}
          secureTextEntry={true}
          />
        <Text>{userText}{emailText}{passwordText}</Text>
        <Button title={"Sign In"} onPress={this.signIn} style={styles.btn} />
        <Button title={"Create Account"} onPress={this.createUser} style={styles.btn} />
        <Footer buttons={footerButtons} />
      </View>
    )
  }
}
