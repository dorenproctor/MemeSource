import React from 'react'
import { Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { createStackNavigator } from 'react-navigation'

import SingleImageScreen from '../screens/SingleImageScreen'
import QuadImageScreen from '../screens/QuadImageScreen'
import SignInScreen from '../screens/SignInScreen'

const SingleImageStack = createStackNavigator({
  SingleImage: SingleImageScreen,
})

const QuadImageStack = createStackNavigator({
  QuadImage: QuadImageScreen,
})

const SignInStack = createStackNavigator({
  SignIn: SignInScreen,
})

export default createStackNavigator({
  QuadImageStack,
  SingleImageStack,
  SignInStack,
}, {
  headerMode: 'none',
})
