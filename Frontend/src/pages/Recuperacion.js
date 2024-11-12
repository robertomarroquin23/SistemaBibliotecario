import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Recuperacion = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserId(parsedUser._id);
        }
      } catch (error) {
        console.error("Error al obtener el usuario de AsyncStorage:", error);
      }
    };

    fetchUserData();
  }, []);

  const changeScreen = () => {
    navigation.navigate("Login");
  };

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "No se pudo encontrar el ID del usuario.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.put(
        `http://192.168.0.8:3000/biblioteca/updatePass/${userId}`,
        //`http://192.168.1.70:3000/biblioteca/updatePass/${userId}`,
        { password }
      );
      if (response.status === 200) {
        Alert.alert("Éxito", "Contraseña actualizada con éxito");
        changeScreen();
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      Alert.alert("Error", "Hubo un problema al actualizar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#ccc"
        placeholder="Nueva contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#ccc"
        placeholder="Vuelva a escribir la nueva contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handlePasswordChange}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Cambiando..." : "Cambiar contraseña"}
        </Text>
      </TouchableOpacity>
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
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Recuperacion;
