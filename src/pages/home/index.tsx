import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const HomePage = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Button title="List Products" onPress={() => navigation.navigate('ProductsList')} />
      <Button title="Manage Comandas" onPress={() => navigation.navigate('CommandPage')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default HomePage;
