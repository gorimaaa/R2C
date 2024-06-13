import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'; // Import correct des fonctions Firestore
import { FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const ChangeUserInfo = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null); // State pour stocker le rôle de l'utilisateur
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const fetchUsers = useCallback(async () => {
        try {
            const usersCollection = collection(FIREBASE_DB, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fonction pour récupérer le rôle de l'utilisateur à partir de son ID
    const fetchUserRole = useCallback(async (userId) => {
        try {
            const userDocRef = doc(FIREBASE_DB, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserRole(userData.role);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchUsers();
        });
        return unsubscribe;
    }, [navigation, fetchUsers]);

    useEffect(() => {
        // Récupérer le rôle de l'utilisateur lorsque les utilisateurs sont chargés
        if (users.length > 0) {
            fetchUserRole(users[0].id); // Ici, prenez le premier utilisateur pour simplifier, adaptez selon votre logique
        }
    }, [users, fetchUserRole]);

    if (loading) {
        return <ActivityIndicator />;
    }

    const formatDate = (date) => {
        return date.toLocaleString('fr-FR', {
            timeZone: 'Europe/Paris', // Changez 'Europe/Paris' par votre fuseau horaire local
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {users.map(user => (
                    <View
                        key={user.id}
                        style={[styles.userContainer, user.role === 'admin' ? styles.adminContainer : null]}
                    >
                        <Text style={styles.fullname}>{user.lastName} {user.firstName}</Text>
                        <Text style={styles.username}>{user.email}</Text>
                        {user.role && (
                            <Text style={[styles.role]}>
                                Rôle : {user.role}
                            </Text>
                        )}
                        {user.lastLogin && (
                            <Text style={[styles.lastLogin, styles.paddingTop]}>
                                Dernière connexion : {formatDate(user.lastLogin.toDate())}
                            </Text>
                        )}
                        
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    userContainer: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    adminContainer: {
        borderColor: 'red', // Bordure rouge pour les admins
    },
    username: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5,
    },
    fullname: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    lastLogin: {
        fontSize: 14,
        color: '#777',
    },
    role: {
        fontSize: 14,
        color: '#555',
    },
    paddingTop: {
        paddingTop: 5, // Ajout de padding en haut du texte du rôle
    },
});

export default ChangeUserInfo;
