import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';


const Login = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
        } catch(error){
            alert('Echec dans la connexion' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
        } catch(error){
            alert('Echec dans l\'inscription' + error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <View>
        <KeyboardAvoidingView behavior='padding'>
          <TextInput style={styles.input} value={email} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
          <TextInput style={styles.input} secureTextEntry={true} value={password} placeholder='password' autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>
            {   loading ?  <ActivityIndicator size="large" color="#000ff" />
            : <>
                <Button title="Login" onPress={signIn}/>
                <Button title="Inscription" onPress={signUp}/>
            </>
            }
          <StatusBar style="auto" />
        </KeyboardAvoidingView>
        </View>
      );
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });

export default Login;