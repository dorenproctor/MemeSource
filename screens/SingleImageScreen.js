import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
    Image
   } from 'react-native';

export default class SingleImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    let Image_Http_URL ={ uri: 'http://ec2-18-188-44-41.us-east-2.compute.amazonaws.com/getImage/0'};
 
    return (
    <Image source={Image_Http_URL} style={{flex:1, height: undefined, width: undefined, resizeMode:"contain", backgroundColor: "black" }} />
 );
  }
}
