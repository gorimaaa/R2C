import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Forms from './App/Screens/FormsScreen/Forms'; 
import Form from './App/Screens/FormsScreen/Form';
import Page1 from './App/Screens/CompletedScreen/Completed';
import Profil from './App/Screens/ProfilScreen/Profil';
import Login from './App/Screens/LoginScreen/Login';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Tab = createBottomTabNavigator();
const FormsStack = createStackNavigator();

function FormsStackScreen() {
  return (
    <FormsStack.Navigator>
      <FormsStack.Screen name="Forms" component={Forms} />
      <FormsStack.Screen name="Form" component={Form} />
    </FormsStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  // On vérifie si un utilisateur s'est connecté ou non
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    })
  }, [])
  
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Login'>
        <Tab.Screen name="Page1" component={Page1} />
        <Tab.Screen name="Forms" component={FormsStackScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="Profil" component={Profil} />
        {user ? null : <Tab.Screen name="Login" component={Login} />}
      </Tab.Navigator>
    </NavigationContainer>
  );
}