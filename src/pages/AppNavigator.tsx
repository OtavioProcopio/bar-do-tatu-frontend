import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './login'
import HomePage from './home';
import ProductsList from './allproducts';
import RegisterScreen from './register';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="ProductsList" component={ProductsList} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
