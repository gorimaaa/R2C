import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importez les composants de vos différentes pages
import Page1 from './App/Screens/CompletedScreen/Completed';
import Page2 from './App/Screens/FormsScreen/Forms';
import Profil from './App/Screens/ProfilScreen/Profil';
import Login from './App/Screens/LoginScreen/Login';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  // On vérifie si un utilisateur s'est connecté ou non
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    })
  }, [])

  return (
   <>
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Login'>
        {user ? (
          // Lorsque l'utlisateur est connecté donc user != null
          <>
          <Tab.Screen name="Page1" component={Page1} />
          <Tab.Screen name="Page2" component={Page2} />
          <Tab.Screen name="Profil" component={Profil} />
          </>
        ) : (
          // Lorsque l'utlisateur est déconnecté
          <>
          <Tab.Screen name="Page1" component={Page1} />
          <Tab.Screen name="Page2" component={Page2} />
          <Tab.Screen name="Login" component={Login} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer> 
    </>
  );
}