//import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Forms from './src/FormsScreen/Forms'; 
import Form from './src/FormsScreen/Form';
import Pdf1 from './src/FormsScreen/Pdf1';
import Page1 from './src/CompletedScreen/Completed';
import Profil from './src/ProfilScreen/Profil';
import SignUp from './src/SignUpScreen/SignUp';
import Login from './src/LoginScreen/Login';
import PDF from './src/PdfScreen/Pdf'

import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Tab = createBottomTabNavigator();
const FormsStack = createStackNavigator();


function FormsStackScreen() {
  return (
    <FormsStack.Navigator>
      <FormsStack.Screen name="Forms" component={Forms} />
      <FormsStack.Screen name="Form" component={Form} />
      <FormsStack.Screen name="Pdf1" component={Pdf1} />
    </FormsStack.Navigator>
  );
}

function LoginStackScreen() {
  return (
    <FormsStack.Navigator>
      <FormsStack.Screen name="Login" component={Login} />
      <FormsStack.Screen name="SignUp" component={SignUp} />
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
      <Tab.Screen name="Forms" component={FormsStackScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Profil" component={Profil} />
      {user ? null : <Tab.Screen name="LoginStackScreen" component={LoginStackScreen}  options={{ headerShown: false }}/>}
      <Tab.Screen name="Pdf" component={PDF}/>
    </Tab.Navigator>
</NavigationContainer>
    
  );
}