import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
  View, Image, Dimensions, Text
} from 'react-native';

export default class QuadImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    let img0 = { uri: 'http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/0' };
    let img1 = { uri: 'http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/1' };
    let img2 = { uri: 'http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/2' };
    let img3 = { uri: 'http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/3' };

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Image
        source = { img0 }
        style={{
          resizeMode: 'stretch',
          backgroundColor: "darkgray",
          height: Dimensions.get('window').height / 2,
          width: Dimensions.get('window').width / 2,
        }} />
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image
          source = { img1 }
          style={{
            resizeMode: 'stretch',
            backgroundColor: "darkgray",
            height: Dimensions.get('window').height / 2,
            width: Dimensions.get('window').width / 2,
          }} 
          />
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image
          source = { img2 }
          style={{
            resizeMode: 'stretch',
            backgroundColor: "darkgray",
            height: Dimensions.get('window').height / 2,
            width: Dimensions.get('window').width / 2,
          }} />
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Image
            source = { img3 }
            style={{
              resizeMode: 'stretch',
              backgroundColor: "darkgray",
              height: Dimensions.get('window').height / 2,
              width: Dimensions.get('window').width / 2,
            }} 
            />
          </View>
       </View>
      </View>
    </View>
  );
  }
}
