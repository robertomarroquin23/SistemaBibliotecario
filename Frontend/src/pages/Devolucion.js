import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import axios from "axios";

const { width } = Dimensions.get("window");

const Devolucion = () => {
  const [librosDetalles, setLibrosDetalles] = useState([]);
  const API_URL = "http://localhost:3000/biblioteca/VerTodasReservas";
  const API_URL2 = "http://localhost:3000/biblioteca/devolverStock";

  const fetchReservas = async () => {
    try {
      const response = await axios.get(API_URL);
      setLibrosDetalles(response.data);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const devolucion = async (codigoPrestamo, libroId) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que quieres devolver este libro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            try {
              await axios.post(API_URL2, { codigoPrestamo, libroId });
              Alert.alert("Éxito", "El libro ha sido devuelto.");
              fetchReservas();
            } catch (error) {
              console.error("Error al devolver el libro:", error);
              Alert.alert("Error", "Hubo un problema al devolver el libro.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Libros Reservados</Text>
      </View>

      <View style={styles.tarjetasContainer}>
        {librosDetalles.length > 0 ? (
          librosDetalles.map((libro, index) => (
            <View key={index} style={styles.cardItem}>
              <Image source={{ uri: libro.image }} style={styles.bookCover} />
              <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{libro.title}</Text>
                <Text style={styles.bookAuthor}>Autor: {libro.author}</Text>
                <Text style={styles.bookUser}>
                  Reservado por: {libro.usuario}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.returnButton}
                  onPress={() =>
                    devolucion(libro.codigoPrestamo, libro.libroId)
                  }
                >
                  <Text style={styles.returnButtonText}>Devolver</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noBooksText}>No tienes libros reservados.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    paddingVertical: 20,
    backgroundColor: "#007BFF",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  tarjetasContainer: {
    padding: 20,
  },
  cardItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  bookCover: {
    width: 80,
    height: 110,
    borderRadius: 8,
    marginRight: 15,
  },
  bookDetails: {
    flex: 1,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
  },
  bookUser: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  actions: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  returnButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  returnButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  noBooksText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Devolucion;
