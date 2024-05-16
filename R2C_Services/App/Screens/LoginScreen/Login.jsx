import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";

const logo = require("../../../assets/logo.png")
const facebook = require("../../../assets/facebook.png")
const linkedin = require("../../../assets/linkedin.png")
const tiktok = require("../../../assets/tiktok.png")


const Login = () =>{
    /*
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);*/
    const [click,setClick] = useState(false);
    const {username,setUsername}=  useState("");
    const {password,setPassword}=  useState("");
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        try {
            const response = await signInWithEmailAndPassword(auth, username, password);
        } catch(error){
            alert('Echec dans la connexion' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        try {
            const response = await createUserWithEmailAndPassword(auth, username, password);
        } catch(error){
            alert('Echec dans l\'inscription' + error.message);
        } finally {
            setLoading(false);
        }
    }
    const navigation = useNavigation();
    const handleSubmit = () => {
      navigation.navigate("SignUp");
    };
    return (
        /*<View>
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
        </View>*/
        <SafeAreaView style={styles.container}>
        
        <Image source={logo} style={styles.image} resizeMode='contain' />
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder='EMAIL OR USERNAME' value={username} onChangeText={setUsername} autoCorrect={false}
        autoCapitalize='none' />
            <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none'/>
        <Pressable style={styles.button} onPress={signUp}>
                    <Text style={styles.buttonText}>Connexion</Text>
                </Pressable>
        </View>
        <View style={styles.rememberView}>
            <View style={styles.switch}>
                <Switch  value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} />
                <Text style={styles.rememberText}>Remember Me</Text>
            </View>
            <View>
                <Pressable onPress={() => Alert.alert("Forget Password!")}>
                    <Text style={styles.forgetText}>Forgot Password?</Text>
                </Pressable>
            </View>
        </View>

      

        <Text style={styles.footerText}>Don't Have Account?<Text style={styles.signup} onPress={handleSubmit}>  Sign Up</Text></Text>

        
    </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    container : {
      alignItems : "center",
      paddingTop: 70,
    },
    image : {
      height : 160,
      width : 170
    },
    title : {
      fontSize : 30,
      fontWeight : "bold",
      textTransform : "uppercase",
      textAlign: "center",
      paddingVertical : 40,
      color : "red"
    },
    inputView : {
      gap : 15,
      width : "100%",
      paddingHorizontal : 40,
      marginBottom  :5
    },
    input : {
      height : 50,
      paddingHorizontal : 20,
      borderColor : "red",
      borderWidth : 1,
      borderRadius: 7
    },
    rememberView : {
      width : "100%",
      paddingHorizontal : 50,
      justifyContent: "space-between",
      alignItems : "center",
      flexDirection : "row",
      marginBottom : 8
    },
    switch :{
      flexDirection : "row",
      gap : 1,
      justifyContent : "center",
      alignItems : "center"
      
    },
    rememberText : {
      fontSize: 13
    },
    forgetText : {
      fontSize : 11,
      color : "red"
    },
    button : {
      backgroundColor : "red",
      height : 45,
      borderColor : "gray",
      borderWidth  : 1,
      borderRadius : 5,
      alignItems : "center",
      justifyContent : "center"
    },
    buttonText : {
      color : "white"  ,
      fontSize: 18,
      fontWeight : "bold"
    }, 
    buttonView :{
      width :"100%",
      paddingHorizontal : 50
    },
    optionsText : {
      textAlign : "center",
      paddingVertical : 10,
      color : "gray",
      fontSize : 13,
      marginBottom : 6
    },
    mediaIcons : {
      flexDirection : "row",
      gap : 15,
      alignItems: "center",
      justifyContent : "center",
      marginBottom : 23
    },
    icons : {
      width : 40,
      height: 40,
    },
    footerText : {
      textAlign: "center",
      color : "gray",
    },
    signup : {
      color : "red",
      fontSize : 13
    }
  })


export default Login;