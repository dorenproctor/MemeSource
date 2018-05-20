import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Image } from 'react-native';

export default class SingleImageScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const img = this.props.navigation.state.params.img;
    return (
    <Image source={img} style={{flex:1, height: undefined, width: undefined, resizeMode:"contain", backgroundColor: "black" }} />
    );
  }
}