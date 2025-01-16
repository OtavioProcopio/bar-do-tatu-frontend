import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        Alert.alert('Registration Successful', 'You can now log in.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Registration Failed', 'Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Registration Error', error.message || 'An unexpected error occurred.');
      } else {
        Alert.alert('Registration Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, width: '80%', marginBottom: 10 },
});

export default RegisterScreen;
