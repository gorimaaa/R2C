import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const ChangeUserInfo = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // Hook to check if the screen is focused

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

    useEffect(() => {
        fetchUsers(); // Initial fetch when the component mounts
    }, [fetchUsers]);

    useEffect(() => {
        // Fetch users again whenever the screen is focused
        const unsubscribe = navigation.addListener('focus', () => {
            fetchUsers();
        });

        // Clean up the subscription when component unmounts
        return unsubscribe;
    }, [navigation, fetchUsers]);

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View style={styles.container}>
            {users.map(user => (
                <Pressable
                    key={user.id}
                    style={styles.userContainer}
                    onPress={() => navigation.navigate('EditUserInfo', { userId: user.id })}
                >
                    <Text style={styles.username}>{user.email}</Text>
                    <Text style={styles.lastname}>{user.lastName}</Text>
                </Pressable>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    userContainer: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastname: {
        fontSize: 14,
        color: '#555',
    },
});

export default ChangeUserInfo;
