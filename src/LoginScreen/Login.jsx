import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { FIREBASE_AUTH } from '../../FirebaseConfig';
const logo = require("../../assets/logo.png");

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleSignIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, username, password);
  } catch(error){
      alert('Echec dans la connexion' + error.message);
  }
};

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={logo} style={styles.logo} resizeMode='contain' />
        <Text style={styles.title}>Bienvenue !</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Pressable style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && styles.checkedCheckbox]} />
            <Text style={styles.rememberMeText}>Se souvenir de moi</Text>
          </Pressable>
          <Pressable
            style={[styles.loginButton, isPressed && styles.loginButtonPressed]}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={handleSignIn}
          >
            <Text style={styles.buttonText}>CONNEXION</Text>
          </Pressable>
        </View>
   
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    marginLeft:10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  checkedCheckbox: {
    backgroundColor: '#3498db', 
  },
  rememberMeText: {
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#3498db', 
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginButtonPressed: {
    backgroundColor: '#2980b9', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    fontSize: 16,
  },
  signUpText: {
    color: '#3498db', 
    textDecorationLine: 'underline',
  },
  loginButtonPressed: {
    backgroundColor: '#2980b9', 
  },
});

export default Login;

