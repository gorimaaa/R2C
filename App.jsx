import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Forms from './src/FormsScreen/Forms'; 
import Form from './src/FormsScreen/Form';
import Pdf1 from './src/FormsScreen/Pdf1';
import Profil from './src/ProfilScreen/Profil';
import SignUp from './src/SignUpScreen/SignUp';
import Login from './src/LoginScreen/Login';
import PDF from './src/PdfScreen/Pdf';
import Test from './src/TestScreen/Test';
import MyForms from './src/MyFormsScreen/MyForms';
import CreateUser from './src/AdminScreen/CreateUser';
import ChangeUserInfo from './src/AdminScreen/ChangeUserInfo';
import EditUserInfo from './src/AdminScreen/EditUserInfo';
import UsersForms from './src/AdminScreen/UsersForms';


import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Tab = createBottomTabNavigator();
const FormsStack = createStackNavigator();


function UserInfoStackScreen() {
  return (
    <FormsStack.Navigator>
      <FormsStack.Screen name="ChangeUserInfo" component={ChangeUserInfo} />
      <FormsStack.Screen name="EditUserInfo" component={EditUserInfo} />
    </FormsStack.Navigator>
  );
}

function UsersFormsStackScreen(){
  return(
    <FormsStack.Navigator>
      <FormsStack.Screen name="UsersForms" component={UsersForms} />
      <FormsStack.Screen name="Pdf" component={PDF} />
    </FormsStack.Navigator>
  )
}

function FormsStackScreen() {
  return (
    <FormsStack.Navigator>
      <FormsStack.Screen name="Forms" component={Forms} />
      <FormsStack.Screen name="Form" component={Form} />
      <FormsStack.Screen name="Pdf1" component={Pdf1} />
    </FormsStack.Navigator>
  );
}

function MyFormsStackScreen() {
  return (
    <FormsStack.Navigator>
      <FormsStack.Screen name="MyForms" component={MyForms} />
      <FormsStack.Screen name="Pdf" component={PDF} />
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
  const [isLoading, setIsLoading] = useState(true);

  // Vérifie si un utilisateur est connecté au démarrage de l'application
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setIsLoading(false); // Fin du chargement une fois que l'état de l'utilisateur est mis à jour
    });

    return unsubscribe; // Nettoie le listener lors du démontage du composant
  }, []);

  if (isLoading) {
    return null; // Peut afficher un écran de chargement pendant que l'application vérifie l'état de l'authentification
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          initialRouteName="Forms"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Forms') {
                iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
              } else if (route.name === 'Profil') {
                iconName = focused ? 'ios-list' : 'ios-list-outline';
              } else if (route.name === 'Pdf') {
                iconName = focused ? 'ios-list' : 'ios-list-outline';
              } else if (route.name === 'Test') {
                iconName = focused ? 'ios-list' : 'ios-list-outline';
              } else if (route.name === 'MyFormsStackScreen') {
                iconName = focused ? 'ios-list' : 'ios-list-outline';
              } else if (route.name === 'AdminPanel') {
                iconName = focused ? 'ios-list' : 'ios-list-outline';
              } else if (route.name === 'CreateUser') {
                iconName = focused ? 'ios-list' : 'ios-list-outline';
              }else if (route.name === 'UserInfoStackScreen') {
                iconName = focused ? 'ios-list' : 'ios-list-outline';
              }else if (route.name === 'UsersFormsStackScreen') {
                iconName = focused ? 'ios-list' : 'ios-list-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="CreateUser" component={CreateUser} />
          <Tab.Screen name = "UserInfoStackScreen" component={UserInfoStackScreen} options={{ headerShown: false, title: "Infos utilisateur" }}/>
          <Tab.Screen name = "UsersFormsStackScreen" component={UsersFormsStackScreen} options={{ headerShown: false, title: "Formulaires d'utilisateurs" }}/>

          <Tab.Screen name="Profil" component={Profil} />
          
        </Tab.Navigator>
      ) : (
        <LoginStackScreen />
      )}
    </NavigationContainer>
  );
}
