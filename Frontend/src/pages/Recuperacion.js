import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

const Recuperacion = () => {
  const navigation = useNavigation();
  const changeScreen = () => {
    navigation.navigate("Login")
  }
  return(
    <View style={styles.container}>
        <TextInput
        style={styles.input}
        placeholderTextColor="#ccc" 
        placeholder="Nueva contraseña"
        />
        <TextInput
        style={styles.input}
        placeholderTextColor="#ccc" 
        placeholder="Vuelva a escribir la nueva contraseña"
        />
        <TouchableOpacity style={styles.button} onPress={changeScreen}>
        <Text style={styles.buttonText}>Cambiar contraseña</Text>
      </TouchableOpacity>
    </View>
  ) 
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    input: {
      width: '80%',
      padding: 15,
      marginVertical: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      borderColor: '#ddd',
      borderWidth: 1,
      fontSize: 16,
      color: '#333',
    },
    button: {
      width: '80%',
      backgroundColor: '#ff4d4d',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
  });
export default Recuperacion;
