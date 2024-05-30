//import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
// react-native-vector-icons/Ionicons otherwise.
import Ionicons from 'react-native-vector-icons/Ionicons';

import Forms from './src/FormsScreen/Forms'; 
import Form from './src/FormsScreen/Form';
import Pdf1 from './src/FormsScreen/Pdf1';
import Profil from './src/ProfilScreen/Profil';
import SignUp from './src/SignUpScreen/SignUp';
import Login from './src/LoginScreen/Login';

import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Tab = createBottomTabNavigator();
const FormsStack = createStackNavigator();


function FormsStackScreen() {
  return (
    <FormsStack.Navigator>
      <FormsStack.Screen name="Forms" component={Forms} options={{title: "BON D'INTERVENTION"}} />
      <FormsStack.Screen name="Form" component={Form} options={{title: "Intervention Cmultiserv"}}/>
      <FormsStack.Screen name="Pdf1" component={Pdf1} />
    </FormsStack.Navigator>
  );
}

function LoginStackScreen() {
  return (
    <FormsStack.Navigator>
      <FormsStack.Screen name="Login" component={Login} options={{title: "Connexion"}} />
      <FormsStack.Screen name="SignUp" component={SignUp}options={{title: "Inscription"}}/>
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
                ? require('./assets/form_focus.png')
                : require('./assets/form.png');
            } if (route.name === 'Profil') {
              iconName = focused
                ? require('./assets/user_focus.png')
                : require('./assets/user.png');
            }if (route.name === 'LoginStackScreen') {
              iconName = focused
                ? require('./assets/completed_focus.png')
                : require('./assets/completed.png');
            }
           
           

            // You can return any component that you like here!
            return <Image source={iconName} style = {{width:size, height:size}}/>;
          },
          tabBarActiveTintColor: '#045084',
          tabBarInactiveTintColor: 'gray',
        })}>
      <Tab.Screen name="Forms" component={FormsStackScreen} options={{ headerShown: false ,title:"Bon d'Interventions"} } />
      {user ? null : <Tab.Screen name="LoginStackScreen" component={LoginStackScreen}  options={{ headerShown: false }}/>}
      <Tab.Screen name="Profil" component={Profil} />
      
    </Tab.Navigator>
</NavigationContainer>
    
  );
}