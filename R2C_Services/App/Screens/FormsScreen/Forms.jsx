import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Form from './Form';
import { useNavigation } from '@react-navigation/native';

const Forms = () => {
  const navigation = useNavigation();

  const navigateToForm = () => {
    navigation.navigate('Form'); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToForm} style={styles.formItem}>
        <Text>Formulaire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formItem: {
    width: '80%',
    height: 100,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default Forms;