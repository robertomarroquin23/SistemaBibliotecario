import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";

const { width } = Dimensions.get("window");

const Devolucion = () => {
  const [reservaDetalles, setReservasDetalles] = useState([]);
  const [infoLibros, setInfoLibros] = useState([]);
  const API_URL = "http://192.168.0.4:3000/biblioteca/VerTodasReservas";
  const API_URL2 = "http://192.168.0.4:3000/biblioteca/devolverStock";
  const API_URL3 = "http://192.168.0.4:3000/ObtenerLibros/getlibrosmongo";

  const cargarReservas = async () => {
    try {
      const response = await axios.get(API_URL);
      setReservasDetalles(response.data);
    } catch (error) {
      console.error("Error al cargar las reservas:", error);
    }

    try {
      const response = await axios.get(API_URL3);
      setInfoLibros(response.data);
    } catch (error) {
      console.error("Error al cargar la info de los libros", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarReservas();
    }, [])
  );

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

              setReservasDetalles((prevReservasDetalles) =>
                prevReservasDetalles.filter(
                  (reserva) => reserva.codigoPrestamo !== codigoPrestamo
                )
              );
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
        {reservaDetalles.length > 0 ? (
          reservaDetalles.map((libro, index) => {
            // Buscar el libro correspondiente en infoLibros
            const libroInfo = infoLibros.find((info) => info._id === libro.libroId);

            return (
              <View key={index} style={styles.cardItem}>
                <View style={styles.bookDetails}>
                  <Text style={styles.bookTitle}>Título: {libroInfo?.title || 'Título no disponible'}</Text>
                  <Text style={styles.bookUser}>
                    Usuario que lo prestó: {libro.usuario}
                  </Text>
                  <Text style={styles.bookDate}>
                    Fecha de préstamo: {libro.fechaPrestamo}
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
            );
          })
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
    flexDirection: "column",
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
  bookDetails: {
    flex: 1,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookUser: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  bookDate: {
    fontSize: 14,
    color: "#666",
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
