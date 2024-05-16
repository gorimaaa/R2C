import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Pdf1 = () => {
  return (
    <View style={styles.container}>
      <Text>Ceci est la page Pdf1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Pdf1;