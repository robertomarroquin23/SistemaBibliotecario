import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DetallesLibro = ({ route, navigation }) => {
  const { book } = route.params;

  const isAvailable = book.disponibilidad === 'Disponible';

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: book.image }} style={styles.bookImage} />

      {/* Círculo de fondo */}
      <View style={styles.backgroundCircle} />

      {/* Contenedor de botones */}
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log("Volver a la pantalla Principal");
            navigation.navigate("MainTabs", { screen: "Principal" });
          }}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreOptionsButton}>
          <Icon name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>By {book.author}</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Chapter</Text>
            <Text style={styles.detailValue}>{book.chapters}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Pages</Text>
            <Text style={styles.detailValue}>{book.pages}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{book.time}</Text>
          </View>
        </View>

        {/* Hacer que el texto sea más transparente */}
        <Text style={[styles.description, styles.transparentText]}>
          {book.description}
        </Text>

        <Text style={[styles.disponibilidad, { color: isAvailable ? 'green' : 'red' }]}>
          Disponibilidad: {book.disponibilidad}
        </Text>

        {isAvailable && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.reserveButton]}>
              <Icon name="event" size={20} color="#fff" />
              <Text style={styles.buttonText}>Reservar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bookImage: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
  },
  backgroundCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 1.5)', 
    borderRadius: 500, 
    transform: [{ scale: 2 }], 
    zIndex: -1, 
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    position: 'absolute',
    top: 40,
    width: '100%',
    zIndex: 1,
  },
  backButton: {
    padding: 10,
  },
  moreOptionsButton: {
    padding: 10,
  },
  card: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 1.8)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    top: -50,
  },
  disponibilidad: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  transparentText: {
    opacity: 0.7, // Ajustar el valor para mayor o menor transparencia
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  reserveButton: {
    width: 350,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#ffd900',
    color: 'black',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default DetallesLibro;
