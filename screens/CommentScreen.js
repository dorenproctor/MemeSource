import React from 'react'
import { View, Text, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView, Dimensions } from 'react-native'
import Footer from '../components/Footer'

export default class SingleImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: props.navigation.state.params.num,
      user: this.props.navigation.state.params.user,
      commentInfo: null,
      turnModalOn: props.navigation.state.params.turnModalOn,
      commentBox: "",
    }
  }

  getComments() {
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/commentInfo/'+this.state.currentIndex)
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

  submitComment() {
    if (!this.state.commentBox) {
      return
    }
    if (!this.state.user) {
      alert("You must be signed in to comment")
      return
    }
    const { goBack } = this.props.navigation
    fetch('http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/postComment', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: this.state.user,
        imageId: this.state.currentIndex,
        content: this.state.commentBox
      })
    }).then((response) => { return response.json() })
      .then((response) => {
        if (response.statusCode == 200) {
          // alert(JSON.stringify(response.content))
          goBack(null)
          alert("Comment submitted")
        } else (
          alert(JSON.stringify(response.message))
        )
    })
    //curl -i -X POST -H 'Content-Type: application/json' -d '{"imageId": "0", "content": "Generic comment.", "user": "someUsername"}' http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/postComment
  }

  render() {
    const { commentInfo, commentBox } = this.state
    const { goBack } = this.props.navigation

    const styles = StyleSheet.create({
      textContainer: {

      },
      commentBox: {
        // position: 'relative',
        // bottom: Dimensions.get('window').height- 50,
      }
    })

    const footerButtons = [
      {"title": "↶", "action": () => goBack(null)},
      {"title": "💬", "action": () => this.myInput.focus()},
      {"title": "", "action": () => null},
      {"title": "Submit Comment", "action": () => this.submitComment()},
    ]
    const comments = !commentInfo ? null : commentInfo.map((obj, i) => {
      return (
        <Text style={styles.text} key={i}>{obj.user+": "+obj.content}</Text>
      )
    })

    
    return (
      <View>
        <TextInput 
          onChangeText={(text) => this.setState({commentBox: text})}
          style={styles.commentBox}
          value={commentBox}
          underlineColorAndroid='transparent'
          multiline={true}
          numberOfLine={10}
          ref={input => this.myInput = input} />
        <ScrollView>
          {comments}
        </ScrollView>
        <Footer buttons={footerButtons}/>
      </View>
    )
  }
}
