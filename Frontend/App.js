import React, { useState, useEffect,View, Text } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native"; 
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 
import { createStackNavigator } from "@react-navigation/stack"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import Login from "./src/pages/LoginScreen/Login";
import Home from "./src/pages/HomeScreen/Home";
import MisLibros from "./src/pages/Mslibros";
import DetallesLibro from "./src/pages/Detallerlibros";
import Perfil from "./src/pages/perfil";
import Devolucion from "./src/pages/Devolucion";
import Principal from "./src/pages/Principal";
import Recuperacion from "./src/pages/Recuperacion";
import Verificacion from "./src/pages/Verificacion";
import manejolibros from "./src/pages/RegistrarLibros";

import Libros from "./src/pages/libros";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = ({ route }) => {
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  useEffect(() => {
    if (route.params?.hideButton) {
      setIsButtonVisible(false);  
    }
  }, [route.params?.hideButton]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Principal") {
            iconName = "home";
          }
          if (route.name === "MisLibros") {
            iconName = "book";
          }
          if (route.name === "Libros") {
            iconName = "book-open";
          }
          if (route.name === "Perfil") {
            iconName = "account";
          }
          if (route.name === "Devolucion") {
            iconName = "refresh";
          }
          if (route.name === "manejolibros") {
            iconName = "book";
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: "#fff",
          borderRadius: 30,
          height: 70,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#ffcc00",
        tabBarInactiveTintColor: "#aaa",
      })}
    >
      <Tab.Screen
        name="Principal"
        component={Principal}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="MisLibros"
        component={MisLibros}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Libros"
        component={Libros}
        options={{ headerShown: false }}
      />
      {isButtonVisible && (
        <Tab.Screen
          name="Devolucion"
          component={Devolucion}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="refresh" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
      )}
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{ headerShown: false }}
      />
        <Tab.Screen
        name="manejolibros"
        component={manejolibros}
        options={{ headerShown: false }}
      />

    </Tab.Navigator>
  );
};

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
          name="Principal"
          component={Principal}
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
