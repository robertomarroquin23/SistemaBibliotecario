
import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 

const Login = () => {
  const navigation = useNavigation(); 

  const handleLogin = () => {
    navigation.navigate('MainTabs'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleb}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput 
        placeholder="Usuario" 
        placeholderTextColor="#ccc" 
        style={styles.input}
      />
      <TextInput 
        placeholder="Contraseña" 
        placeholderTextColor="#ccc" 
        style={styles.input} 
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      <Text style={styles.orText}>O continúa con:</Text>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <MaterialCommunityIcons name="facebook" size={24} color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <MaterialCommunityIcons name="apple" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  titleb: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 30,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#ff4d4d',
    marginTop: 15,
    fontSize: 14,
  },
  orText: {
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  socialButton: {
    backgroundColor: 'transparent',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  }, 
}); 
 
export default Login; 
