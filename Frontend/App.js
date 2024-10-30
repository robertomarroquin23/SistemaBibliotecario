import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Login from './src/pages/LoginScreen/Login';
import Home from './src/pages/HomeScreen/Home';

import Login from './src/pages/Login';
import MisLibros from './src/pages/Mslibros';
import DetallesLibro from './src/pages/Detallerlibros';
import Principal from './src/pages/Principal'
import Recuperacion from './src/pages/Recuperacion';
import Verificacion from './src/pages/Verificacion';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="DetallesLibro"
          component={DetallesLibro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Verificacion"
          component={Verificacion}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Recuperacion"
          component={Recuperacion}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;