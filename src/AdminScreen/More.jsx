import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';


const More = () => {
  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };
  const navigation = useNavigation();

  const navigateToForm = (name) => {
    navigation.navigate('AdminPdf', { name });
  };

  const handleCreateUser = () => {
    navigation.navigate('CreateUser');
  
  };

  const handleChangeUserInfo = () => {
    navigation.navigate('UserInfoStackScreen');

  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.link} onPress={handleCreateUser}>
        <Text style={styles.linkText}>Créer un utilisateur</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={handleChangeUserInfo}>
        <Text style={styles.linkText}>Gérer les utilisateurs</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  linkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
