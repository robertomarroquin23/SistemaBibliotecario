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
//import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  URL_GETUSER = "http://192.168.0.4:3000/biblioteca/getbyid";
  //URL_GETUSER= "http://192.168.1.70:3000/biblioteca/getbyid";

  const Recuperacion = () => {
    navigation.navigate("Verificacion");
  };

  const handleLogin = async () => {
    try {
      //const response = await axios.post("http://192.168.1.70:3000/biblioteca/login", {
      const response = await axios.post(
        "http://192.168.0.8:3000/biblioteca/login",
        {
          email: email,
          password: password,
        }
      );

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

      // Navegar a la siguiente pantalla si el login es exitoso
      //navigation.navigate("Principal");
      navigation.navigate("MainTabs");
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
      <View style={styles.form}>
        <Text style={styles.title}>INICIA SESION</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.forgotPassword} onPress={Recuperacion}>
          ¿Olvidaste tu contraseña?
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  button: {
    width: "100%",
    backgroundColor: "#007BFF",
    paddingVertical: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  forgotPassword: {
    color: "#ff4d4d",
    marginTop: 15,
    fontSize: 14,
  },
});

export default LoginScreen;
