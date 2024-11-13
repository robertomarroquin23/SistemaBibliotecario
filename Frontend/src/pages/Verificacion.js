import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Verificacion = () => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const [email, setEmail] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const navigation = useNavigation();
  URL_GETUSER = "http://192.168.10.138:3000/biblioteca/getbyid";
  //URL_GETUSER= "http://192.168.1.70:3000/biblioteca/getbyid";

  const generateVerificationCode = async () => {
    const code = Math.floor(1000 + Math.random() * 9000);
    setVerificationCode(code);
    setIsEmailVerified(true);

    try {
      const response = await axios.post(
        "http://192.168.10.138:3000/biblioteca/verifyEmail",
        {
          email,
        }
      );

      try {
        //const mail = await axios.post("http://192.168.1.70:3000/biblioteca/sendEmail", {
        const mail = await axios.post(
          "http://192.168.10.138:3000/biblioteca/sendEmail",
          {
            email,
            code,
          }
        );

        if (mail.data._id) {
          const id = mail.data._id;
          console.log(userId);
          try {
            clearImmediate;
            const userResponse = await axios.get(`${URL_GETUSER}/${id}`);
            if (userResponse.status === 200) {
              const userData = userResponse.data;
              await AsyncStorage.setItem("user", JSON.stringify(userData));
              const user = JSON.parse(await AsyncStorage.getItem("user"));
            } else {
              console.log("Error al obtener usuario:", response.data);
            }
          } catch (error) {
            console.error("Error en la petición:", error);
          }
        }

        Alert.alert(
          "Éxito",
          "El código de verificación ha sido enviado a tu correo."
        );
      } catch (error) {
        console.error("Error al enviar el correo:", error);
        Alert.alert(
          "Error",
          "Hubo un problema al enviar el código de verificación."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Ingrese un correo o el correo que ha ingresado no esta registrado."
      );
    }
  };

  const verifyCode = () => {
    if (enteredCode == verificationCode) {
      navigation.navigate("Recuperacion");
    } else {
      Alert.alert("Error", "Código incorrecto. Intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#ccc"
        placeholder="Ingrese su correo electronico"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={generateVerificationCode}
      >
        <Text style={styles.buttonText}>Verificar correo</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholderTextColor="#ccc"
        placeholder="Ingrese el código"
        value={enteredCode}
        onChangeText={setEnteredCode}
        editable={isEmailVerified}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={verifyCode}
        disabled={!isEmailVerified}
      >
        <Text style={styles.buttonText}>Verificar código</Text>
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
  verificationCodeText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
  },
});

export default Verificacion;
