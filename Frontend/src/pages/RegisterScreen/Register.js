import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
    // Estado para los campos de usuario
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        personalEmail: '',
        birthday: ''
    });

    // Maneja cambios en los campos
    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    // Enviar datos al servidor
    const handleRegister = async () => {
        try {
            const response = await axios.post('http://192.168.0.4:3000/biblioteca/register', {
                username: form.username,
                email: form.email,
                password: form.password,
                address: {
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    postalCode: form.postalCode
                },
                phone: form.phone,
                personalEmail: form.personalEmail,
                birthday: form.birthday
            });
            Alert.alert('Registro exitoso', response.data.msg);
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error en el registro', error.response?.data?.msg);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Registro de Usuario</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                value={form.username}
                onChangeText={(value) => handleChange('username', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={form.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={form.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Calle"
                value={form.street}
                onChangeText={(value) => handleChange('street', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Ciudad"
                value={form.city}
                onChangeText={(value) => handleChange('city', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Estado"
                value={form.state}
                onChangeText={(value) => handleChange('state', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Código postal"
                value={form.postalCode}
                onChangeText={(value) => handleChange('postalCode', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={form.phone}
                onChangeText={(value) => handleChange('phone', value)}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Correo personal"
                value={form.personalEmail}
                onChangeText={(value) => handleChange('personalEmail', value)}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Fecha de nacimiento (YYYY-MM-DD)"
                value={form.birthday}
                onChangeText={(value) => handleChange('birthday', value)}
            />

            <Button title="Registrarse" onPress={handleRegister} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 12,
        borderRadius: 4
    }
});

export default RegisterScreen;