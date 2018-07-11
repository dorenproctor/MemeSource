import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Footer from '../components/Footer'

export default class SingleImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      currentNumber: props.navigation.state.params.num,
      user: this.props.navigation.state.params.user,
      commentInfo: null,
      turnModalOn: props.navigation.state.params.turnModalOn,
    }
  }

  getComments() {
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/commentInfo/'+this.state.currentNumber)
    .then((response) => {
      return response.json()
    }).then((json) => {
      this.setState({ commentInfo: json.content })
      // alert(JSON.stringify(json.content))
    }).catch(err => {
      console.log(err)
      alert("Could not fetch comments")
    })
  }

  componentWillUnmount() {
    this.state.turnModalOn()
  }

  componentDidMount() {
    this.getComments()
  }

  render() {
    const { commentInfo } = this.state
    const { goBack } = this.props.navigation

    const footerButtons = [
      {"title": "↶", "action": () => goBack(null)},
      {"title": "💬", "action": () => null},
      {"title": "", "action": () => null},
      {"title": "", "action": () => null},
    ]
    const styles = StyleSheet.create({
      textContainer: {

      },
    })
    const comments = !commentInfo ? null : commentInfo.map((obj, i) => {
      return (
        <Text style={styles.text} key={i}>{obj.content}</Text>
      )
    })
    
    return (
      <View>
        <ScrollView>
          {comments}
        </ScrollView>
        <Footer buttons={footerButtons}/>
      </View>
    )
  }
}
