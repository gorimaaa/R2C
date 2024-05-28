//import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
// react-native-vector-icons/Ionicons otherwise.
import Ionicons from 'react-native-vector-icons/Ionicons';

import Forms from './src/FormsScreen/Forms'; 
import Form from './src/FormsScreen/Form';
import Pdf1 from './src/FormsScreen/Pdf1';
import Page1 from './src/CompletedScreen/Completed';
import Profil from './src/ProfilScreen/Profil';
import SignUp from './src/SignUpScreen/SignUp';
import Login from './src/LoginScreen/Login';
import PDF from './src/PdfScreen/Pdf'
import Test from './src/TestScreen/Test'

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
  const [user, setUser] = useState(null);

  // On vérifie si un utilisateur s'est connecté ou non
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    })
  }, [])
  
  return (
<NavigationContainer>
    <Tab.Navigator initialRouteName='Login' 
    screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Forms') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } 
            if (route.name === 'Profil') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }
            if (route.name === 'LoginStackScreen') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }
            if (route.name === 'Pdf') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }
            if (route.name === 'Test') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
      <Tab.Screen name="Forms" component={FormsStackScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Profil" component={Profil} />
      {user ? null : <Tab.Screen name="LoginStackScreen" component={LoginStackScreen}  options={{ headerShown: false }}/>}
      <Tab.Screen name="Pdf" component={PDF}/>
      <Tab.Screen name="Test" component={Test}/>

    </Tab.Navigator>
</NavigationContainer>
    
  );
}