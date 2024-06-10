import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { updatePassword, getUserByEmail } from 'firebase/auth';

const EditUserInfo = ({ route, navigation }) => {
    const { userId } = route.params;
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = doc(FIREBASE_DB, 'users', userId);
                const userSnapshot = await getDoc(userDoc);
                if (userSnapshot.exists()) {
                    setUserData(userSnapshot.data());
                } else {
                    Alert.alert('Utilisateur non trouvé');
                    navigation.goBack();
                }
            } catch (error) {
                Alert.alert('Erreur lors de la récupération des informations utilisateur : ' + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleUpdate = async () => {
        try {
            setLoading(true);

            // Update lastName and firstName in Firestore
            const userDoc = doc(FIREBASE_DB, 'users', userId);
            await updateDoc(userDoc, {
                lastName: userData.lastName,
                firstName: userData.firstName,
            });

            // Get the user object from Firebase Authentication
            const user = await getUserByEmail(FIREBASE_AUTH, "bernard@tapie.fr");
            console.log(user);
            // Update password in Firebase Authentication
            if (userData.newPassword) {
                await updatePassword(user, userData.newPassword);
                Alert.alert('Mot de passe mis à jour avec succès');
            }

            navigation.goBack();
        } catch (error) {
            Alert.alert("Erreur : " + error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='Nom'
                value={userData.lastName}
                onChangeText={text => setUserData({ ...userData, lastName: text })}
                autoCorrect={false}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                placeholder='Prénom'
                value={userData.firstName}
                onChangeText={text => setUserData({ ...userData, firstName: text })}
                autoCorrect={false}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                placeholder='Nouveau mot de passe'
                secureTextEntry
                onChangeText={text => setUserData({ ...userData, newPassword: text })}
                autoCorrect={false}
                autoCapitalize='none'
            />
            <Pressable style={styles.button} onPress={handleUpdate} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Mettre à jour</Text>}
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#3498db",
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditUserInfo;
