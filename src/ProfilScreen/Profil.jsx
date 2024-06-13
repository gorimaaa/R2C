import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { collection, doc, getDoc } from 'firebase/firestore';

// Importez votre logo ici une fois que vous l'avez
const LogoImage = require("../../assets/logo.png"); // Remplacez par le chemin correct de votre logo

const Profil = () => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userId = FIREBASE_AUTH.currentUser.uid;
                const userDocRef = doc(FIREBASE_DB, 'users', userId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    if (!userProfile) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={LogoImage} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Profil Utilisateur</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Nom complet:</Text>
                <Text style={styles.value}>{userProfile.lastName} {userProfile.firstName}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userProfile.email}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Rôle:</Text>
                <Text style={styles.value}>{userProfile.role}</Text>
            </View>
            {/* Vous pouvez ajouter d'autres informations ici */}
            <Button onPress={() => FIREBASE_AUTH.signOut()} title="Déconnexion"/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 150, // Ajustez la largeur selon votre logo
        height: 150, // Ajustez la hauteur selon votre logo
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    value: {
        fontSize: 18,
    },
});

export default Profil;
