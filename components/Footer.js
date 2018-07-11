import React from 'react'
import { View, Button, StyleSheet, Dimensions } from 'react-native'

export default class Footer extends React.Component {
  render() {
    const { buttons, customStyle } = this.props
    const styles = customStyle ? customStyle : StyleSheet.create({
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

        position: 'absolute',
        left: 0, 
        top: Dimensions.get('window').height - 50,
        bottom: Dimensions.get('window').height, 
        width: Dimensions.get('window').width,
      },
      buttonContainer: {
        flex: 1,
      }
    })
    const renderButtons = buttons.map((obj, i) => {
      return (
        <View style={styles.buttonContainer} key={i}>
          <Button title={obj.title} onPress={obj.action} style={styles.btn} color={"#5c5c5c"} key={i}/>
        </View>
      )
    })

    return (
      <View style={styles.container}>
        {renderButtons}
      </View>
    )
  }
}
