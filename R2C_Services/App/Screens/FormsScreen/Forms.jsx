import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FormItem = ({ name, formName }) => {
  const navigation = useNavigation();

  const navigateToForm = () => {
    navigation.navigate('Form', { formName });
  };

  return (
    <TouchableOpacity onPress={navigateToForm} style={styles.formItem}>
      <Text>{name}</Text>
    </TouchableOpacity>
  );
};

const Forms = () => {
  return (
    <View style={styles.container}>
      <FormItem name="Formulaire" formName="Form" />
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