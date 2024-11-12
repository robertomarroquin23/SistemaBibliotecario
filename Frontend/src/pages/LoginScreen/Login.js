import React, { useState } from "react";
import {
  View,
  Text,
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
URL_GETUSER= "http://192.168.11.115:3000/biblioteca/getbyid";
//URL_GETUSER= "http://192.168.1.70:3000/biblioteca/getbyid";

  const Recuperacion = () => { 
    navigation.navigate('Verificacion'); 
  }; 

  const handleLogin = async () => {
    try {


      //const response = await axios.post("http://192.168.1.70:3000/biblioteca/login", {
      const response = await axios.post("http://192.168.11.115:3000/biblioteca/login", {
        email: email,
        password: password,
      });
  
      if (response.data.id) {
        const id = response.data.id;
        console.log(id);
  
        try {
          const userResponse = await axios.get(`${URL_GETUSER}/${id}`);
          if (userResponse.status === 200) { 
            const userData = userResponse.data; 
            await AsyncStorage.setItem("user", JSON.stringify(userData)); 
            const user = JSON.parse(await AsyncStorage.getItem("user"));
            console.log(user.roll);
  
            navigation.navigate("MainTabs", {
              hideButton: user.roll === 1,
            });
          } else {
            console.log("Error al obtener usuario:", response.data);
          }
        } catch (error) {
          console.error("Error en la petición:", error);
        }
      }
  
      await AsyncStorage.setItem("token", response.data.token); 
    } catch (error) { 
      if (error.response && error.response.status === 400) { 
        Alert.alert("Error", "Credenciales incorrectas");
      } else {
        Alert.alert("Error", "Hubo un problema con el servidor", error);
        console.error("Error en la petición:", error);
      }
    }
  };
    
  return (
    <View style={styles.container}>
      <Text style={styles.titleb}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        style={styles.input} 
        placeholder="Email" 
        placeholderTextColor="#ccc"
        value={email} 
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.forgotPassword} onPress={Recuperacion}>¿Olvidaste tu contraseña?</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  titleb: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#888",
    marginBottom: 30,
  },
  input: {
    width: "80%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "80%",
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#ff4d4d",
    marginTop: 15,
    fontSize: 14,
  },
});

export default LoginScreen;
