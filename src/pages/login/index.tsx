import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password,
      });
  
      const { token } = response.data;
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        navigation.navigate('Home');
      } 
      Alert.alert('Login Failed', 'Token not received');
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          Alert.alert('Invalid Credentials', 'Please check your email and password.');
        } else {
          Alert.alert('Login Error', error.message || 'An unexpected error occurred.');
        }
      } 
      Alert.alert('Login Error', 'An unexpected error occurred.');
      
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não se inscreveu ainda? Inscreva-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, width: '80%', marginBottom: 10 },
  link: { marginTop: 15, color: 'blue' }
});

export default LoginScreen;
