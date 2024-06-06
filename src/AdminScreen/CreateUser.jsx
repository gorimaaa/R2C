import { StatusBar } from 'expo-status-bar';
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, setDoc, getDoc, doc } from "firebase/firestore";

import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Menu, Divider, Provider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Importer GestureHandlerRootView

const logo = require("../../assets/logo.png");

const CreateUser = () => {
    const [click, setClick] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [role, setRole] = useState("user");
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const navigateToLogin = () => {
        navigation.navigate('Login');
    };

    const UserCreate = async () => {
        try {
            setLoading(true);
            console.log('Starting user creation process');
            
            const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, username, password);
            const uid = response.user.uid; // Get the user ID
            console.log('User created with UID:', uid);

            const userData = {
                id: uid,
                email: username,
                firstName : firstname,
                lastName : lastname,
                role: role,
            };

            // Create the document in Firestore with the user's UID as the document ID
            const userDoc = doc(FIREBASE_DB, 'users', uid);
            await setDoc(userDoc, userData); // Add user data to Firestore with UID as document ID
            console.log('User data added to Firestore with UID as document ID');

            Alert.alert('Compte créé avec succès');
            
            // Retrieve and display user role
            await getUserRole(uid);

        } catch (error) {
            console.error('Error during user creation:', error);
            Alert.alert('Echec dans l\'inscription ' + error.message);
        } finally {
            setLoading(false); // Set loading state back to false after completion (both success and failure)
            console.log('User creation process finished');
        }
    };

    const getUserRole = async (uid) => {
        try {
            const userDoc = doc(FIREBASE_DB, 'users', uid); // Access the user's document in Firestore
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                Alert.alert(`Le rôle de l'utilisateur est : ${userData.role}`);
            } else {
                Alert.alert('Utilisateur non trouvé');
            }
        } catch (error) {
            Alert.alert('Erreur lors de la récupération du rôle de l\'utilisateur ' + error.message);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <SafeAreaView style={styles.container}>
                        <Image source={logo} style={styles.image} resizeMode='contain' />
                        <Text style={styles.title}>Créer un utilisateur</Text>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.input}
                                placeholder='NOM'
                                value={lastname}
                                onChangeText={setLastname}
                                autoCorrect={false}
                                autoCapitalize='none'
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='PRENOM'
                                value={firstname}
                                onChangeText={setFirstname}
                                autoCorrect={false}
                                autoCapitalize='none'
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='EMAIL'
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

                        {/* Menu déroulant pour sélectionner le rôle */}
                        <View style={styles.menuView}>
                            <Menu
                                visible={visible}
                                onDismiss={() => setVisible(false)}
                                anchor={
                                    <Pressable style={styles.menuAnchor} onPress={() => setVisible(true)}>
                                        <Text style={styles.menuText}>{role === 'user' ? 'Utilisateur' : 'Administrateur'}</Text>
                                    </Pressable>
                                }
                            >
                                <Menu.Item onPress={() => { setRole('user'); setVisible(false); }} title="Utilisateur" />
                                <Divider />
                                <Menu.Item onPress={() => { setRole('admin'); setVisible(false); }} title="Administrateur" />
                            </Menu>
                        </View>

                        <View style={styles.buttonView}>
                            <Pressable style={styles.button} onPress={UserCreate} disabled={loading}>
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Créer le compte</Text>}
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </Provider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 70,
    },
    scrollViewContent: {
        flexGrow: 1,
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
        borderRadius: 7,
    },
    menuView: {
        width: "100%",
        paddingHorizontal: 40,
        marginBottom: 20,
        alignItems: "center"
    },
    menuAnchor: {
        borderColor: "red",
        borderWidth: 1,
        borderRadius: 7,
        padding: 15,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuText: {
        fontSize: 16,
        color: 'red'
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 50,
        margin: 15,
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
    }
});

export default CreateUser;
