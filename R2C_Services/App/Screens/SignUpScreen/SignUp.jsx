import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const logo = require("../../../assets/logo.png");
const facebook = require("../../../assets/facebook.png");
const linkedin = require("../../../assets/linkedin.png");
const tiktok = require("../../../assets/tiktok.png");

const SignUp = () => {
    const [click, setClick] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const auth = FIREBASE_AUTH;
    const [loading, setLoading] = useState(false); // Ajout de loading

    const signIn = async () => {
        try {
            setLoading(true); // Ajout de setLoading
            const response = await signInWithEmailAndPassword(auth, username, password);
        } catch (error) {
            alert('Echec dans la connexion ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async () => {
        try {
            setLoading(true); // Ajout de setLoading
            const response = await createUserWithEmailAndPassword(auth, username, password);
        } catch (error) {
            alert('Echec dans l\'inscription ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={logo} style={styles.image} resizeMode='contain' />
            <Text style={styles.title}>Inscription</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    placeholder='Nom'
                    value={lastname}
                    onChangeText={setLastname}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Prénom'
                    value={firstname}
                    onChangeText={setFirstname}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='EMAIL OR USERNAME'
                    value={username}
                    onChangeText={setUsername}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='PASSWORD'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='CONFIRM PASSWORD'
                    secureTextEntry
                    autoCorrect={false}
                    autoCapitalize='none'
                />
            </View>

            <View style={styles.buttonView}>
                <Pressable style={styles.button} onPress={signUp} disabled={loading}>
                    <Text style={styles.buttonText}>S'INSCRIRE</Text>
                </Pressable>
            </View>

            <Text style={styles.footerText}>
                Already Have an Account?<Text style={styles.signup}> Login</Text>
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 70,
    },
    image: {
        height: 120,
        width: 120
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 40,
        color: "red"
    },
    inputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 40,
        marginBottom: 5
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: "red",
        borderWidth: 1,
        borderRadius: 7
    },
    rememberView: {
        width: "100%",
        paddingHorizontal: 50,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 8
    },
    switch: {
        flexDirection: "row",
        gap: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    rememberText: {
        fontSize: 13
    },
    forgetText: {
        fontSize: 11,
        color: "red"
    },
    button: {
        backgroundColor: "red",
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 50,
        margin:15,
    },
    optionsText: {
        textAlign: "center",
        paddingVertical: 10,
        color: "gray",
        fontSize: 13,
        marginBottom: 6
    },
    mediaIcons: {
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 23
    },
    icons: {
        width: 40,
        height: 40
    },
    footerText: {
        textAlign: "center",
        color: "gray" 
    },
    signup: {
        color: "red",
        fontSize: 13
    }
});

export default SignUp;
