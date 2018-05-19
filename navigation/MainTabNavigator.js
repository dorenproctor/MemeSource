import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import SingleImageScreen from '../screens/SingleImageScreen';
import QuadImageScreen from '../screens/QuadImageScreen';


const SingleImageStack = createStackNavigator({
  SingleImage: SingleImageScreen,
});

SingleImageStack.navigationOptions = {
  tabBarLabel: 'Single Image',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const QuadImageStack = createStackNavigator({
  QuadImage: QuadImageScreen,
});

QuadImageStack.navigationOptions = {
  tabBarLabel: 'Quad Image',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};


export default createBottomTabNavigator({
  QuadImageStack,
  SingleImageStack,
});
