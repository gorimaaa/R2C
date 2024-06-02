import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Forms from './src/FormsScreen/Forms'; 
import Form from './src/FormsScreen/Form';
import FormR2C from './src/FormsScreen/FormR2C';
import Pdf1 from './src/FormsScreen/Pdf1';
import PDF from './src/PdfScreen/Pdf';
import MyForms from './src/MyFormsScreen/MyForms';
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
      <FormsStack.Screen name="FormR2C" component={FormR2C} options={{title: "Intervention R2C"}}/>
      <FormsStack.Screen name="Pdf1" component={Pdf1} />
    </FormsStack.Navigator>
  );
}

function LoginStackScreen() {
  return (
    <FormsStack.Navigator>
      <FormsStack.Screen name="Login" component={Login} options={{title: "Connexion"}} />
      <FormsStack.Screen name="SignUp" component={SignUp} options={{title: "Inscription"}}/>
    </FormsStack.Navigator>
  );
}

function MyFormsStackScreen() {
  return (
    <FormsStack.Navigator>
      <FormsStack.Screen name="MyForms" component={MyForms} options={{title:"Complété"}} />
      <FormsStack.Screen name="Pdf" component={PDF} />
    </FormsStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          initialRouteName='Forms'
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Forms') {
                iconName = focused
                  ? require('./assets/form_focus.png')
                  : require('./assets/form.png');
              } else if (route.name === 'Profil') {
                iconName = focused
                  ? require('./assets/user_focus.png')
                  : require('./assets/user.png');
              } else if (route.name === 'MyForms') {
                iconName = focused
                  ? require('./assets/completed_focus.png')
                  : require('./assets/completed.png');
              }

              return <Image source={iconName} style={{ width: size, height: size }} />;
            },
            tabBarActiveTintColor: '#045084',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Forms" component={FormsStackScreen} options={{ headerShown: false, title: "Bon d'Interventions" }} />
          <Tab.Screen name="MyForms" component={MyFormsStackScreen} options={{ headerShown: false, title: "Complété" }} />
          <Tab.Screen name="Profil" component={Profil} />
        </Tab.Navigator>
      ) : (
        <LoginStackScreen />
      )}
    </NavigationContainer>
  );
}
