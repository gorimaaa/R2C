import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Form = () => {
  return (
    <View style={styles.container}>
      <Text>Ceci est l'écran Form</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Form;