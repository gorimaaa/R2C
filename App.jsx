import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from './FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import Forms from './src/FormsScreen/Forms'; 
import Form from './src/FormsScreen/Form';
import FormR2C from './src/FormsScreen/FormR2C';
import Pdf1 from './src/FormsScreen/Pdf1';
import PDF from './src/PdfScreen/Pdf';
import MyForms from './src/MyFormsScreen/MyForms';
import Profil from './src/ProfilScreen/Profil';
import SignUp from './src/SignUpScreen/SignUp';
import Login from './src/LoginScreen/Login';
import CreateUser from './src/AdminScreen/CreateUser';
import ChangeUserInfo from './src/AdminScreen/ChangeUserInfo';
import EditUserInfo from './src/AdminScreen/EditUserInfo';
import UsersForms from './src/AdminScreen/UsersForms';
import AdminPdf from './src/AdminScreen/AdminPdf';
import More from './src/AdminScreen/More';

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
      <FormsStack.Screen name="UsersForms" component={UsersForms} options={{title: "Bon D'interventions"}} />
      <FormsStack.Screen name="AdminPdf" component={AdminPdf} options={{title: "Intervention"}}/>
    </FormsStack.Navigator>
  )
}

function MoreStackScreen() {
  return (
    <FormsStack.Navigator>
      <Tab.Screen name="More" component={More} options={{title: "Options"}}/>
      <Tab.Screen name="CreateUser" component={CreateUser} />
      <Tab.Screen name = "UserInfoStackScreen" component={UserInfoStackScreen} options={{ headerShown: false, title: "Bon D'interventions" }}/>
    </FormsStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const fetchUserRole = useCallback(async (userId) => {
    try {
      console.log('Fetching user role for user ID:', userId);
      const userDocRef = doc(FIREBASE_DB, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        console.log('Document exists:', userDoc);
        const userData = userDoc.data();
        console.log('User data:', userData);
        setRole(userData.role);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('Auth state changed:', user);
      setUser(user);
      if (user) {
        fetchUserRole(user.uid);
      } else {
        setRole(null);
      }
    });
    return unsubscribe;
  }, [fetchUserRole]);

  console.log('Current user:', user);
  console.log('Current role:', role);

  return (
    <NavigationContainer>
      {user ? (
        role === 'admin' ? (
          <Tab.Navigator
            initialRouteName='UsersForms'
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'CreateUser') {
                  iconName = focused
                    ? require('./assets/form_focus.png')
                    : require('./assets/form.png');
                } else if (route.name === 'UserInfoStackScreen') {
                  iconName = focused
                    ? require('./assets/user_focus.png')
                    : require('./assets/user.png');
                } else if (route.name === 'UsersFormsStackScreen') {
                  iconName = focused
                    ? require('./assets/completed_focus.png')
                    : require('./assets/completed.png');
                } else if (route.name === 'MoreStackScreen') {
                  iconName = focused
                    ? require('./assets/menu_focus.png')
                    : require('./assets/menu.png');
                }

                return <Image source={iconName} style={{ width: size, height: size }} />;
              },
              tabBarActiveTintColor: '#045084',
              tabBarInactiveTintColor: 'gray',
            })}
          >
          <Tab.Screen name = "UsersFormsStackScreen" component={UsersFormsStackScreen} options={{ headerShown: false, title: "Bon D'interventions" }}/>
          <Tab.Screen name = "MoreStackScreen" component={MoreStackScreen} options={{ headerShown: false, title: "Options" }}/>

          </Tab.Navigator>
        ) : (
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
        )
      ) : (
        <LoginStackScreen />
      )}
    </NavigationContainer>
  );
}