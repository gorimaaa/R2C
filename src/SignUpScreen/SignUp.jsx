import { StatusBar } from 'expo-status-bar';
import { Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const logo = require("../../assets/logo.png");

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const navigateToLogin = () => {
      navigation.navigate('Login'); 
    };

    const signUp = async () => {
        try {
            setLoading(true);
            const auth = FIREBASE_AUTH;
            const response = await createUserWithEmailAndPassword(auth, username, password);
            setLoading(false);
        } catch (error) {
            alert('Échec de l\'inscription: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={logo} style={styles.logo} resizeMode='contain' />
                <Text style={styles.title}>Inscription</Text>
                <View style={styles.formContainer}>
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
                        placeholder="Email ou Nom d'utilisateur"
                        value={username}
                        onChangeText={setUsername}
                        autoCorrect={false}
                        autoCapitalize='none'
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Mot de passe'
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        autoCorrect={false}
                        autoCapitalize='none'
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Confirmer le mot de passe'
                        secureTextEntry
                        autoCorrect={false}
                        autoCapitalize='none'
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={signUp} disabled={loading}>
                        <Text style={styles.buttonText}>INSCRIPTION</Text>
                    </Pressable>
                </View>

                <Text style={styles.footerText}>
                    Vous avez déjà un compte?{' '}
                    <Pressable onPress={navigateToLogin} disabled={loading}>
                        <Text style={styles.loginLink}>Connexion</Text>
                    </Pressable>
                </Text>
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
        justifyContent: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3498db',
        height: 50,
        width: '50%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
    loginLink: {
        color: '#3498db',
    },
});

export default SignUp;