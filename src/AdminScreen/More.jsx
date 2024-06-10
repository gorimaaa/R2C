import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const More = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    FIREBASE_AUTH.signOut()
  };

  const handleCreateUser = () => {
    navigation.navigate('CreateUser');
  };

  const handleChangeUserInfo = () => {
    navigation.navigate('UserInfoStackScreen');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Options</Text>
      </View>
      <TouchableOpacity style={styles.option} onPress={handleCreateUser}>
        <Text style={styles.optionText}>Créer un utilisateur</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleChangeUserInfo}>
        <Text style={styles.optionText}>Gérer les utilisateurs</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.option, styles.logoutButton]} onPress={handleLogout}>
        <Text style={[styles.optionText, styles.logoutButtonText]}>Déconnexion</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version: 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  logoutButton: {

  },
  logoutButtonText: {
    color: '#007BFF', // White text for the logout button
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});
