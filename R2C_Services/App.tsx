import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importez les composants de vos différentes pages
import Page1 from './App/Screens/CompletedScreen/Completed';
import Page2 from './App/Screens/FormsScreen/Forms';
import Page3 from './App/Screens/ProfilScreen/Profil';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
   <>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Page1" component={Page1} />
        <Tab.Screen name="Page2" component={Page2} />
        <Tab.Screen name="Page3" component={Page3} />
      </Tab.Navigator>
    </NavigationContainer>
    </>
  );
}