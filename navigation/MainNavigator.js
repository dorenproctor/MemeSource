import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from 'react-navigation';

import SingleImageScreen from '../screens/SingleImageScreen';
import QuadImageScreen from '../screens/QuadImageScreen';

const SingleImageStack = createStackNavigator({
  SingleImage: SingleImageScreen,
});

const QuadImageStack = createStackNavigator({
  QuadImage: QuadImageScreen,
});

export default createStackNavigator({
  QuadImageStack,
  SingleImageStack,
}, {
  headerMode: 'none',
});
