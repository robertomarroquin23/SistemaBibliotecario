import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";

const { width } = Dimensions.get("window");

const MisLibros = ({ navigation }) => {
  const API_URL = "http://192.168.1.63:3000/biblioteca/VerReservas";
  const API_URL2 = "http://192.168.1.63:3000/ObtenerLibros/getlibrosmongo";

  const [librosDetalles, setLibrosDetalles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseReservas = await axios.post(API_URL, { userId: "183021" });
        const reservas = responseReservas.data;

        const librosIds = reservas
          .filter((reserva) => reserva.idAlumno === "183021")
          .map((reserva) => reserva.libroId);

        if (librosIds.length > 0) {
          const responseLibros = await axios.get(API_URL2);
          const todosLibros = responseLibros.data;

          const librosFiltrados = todosLibros.filter((libro) =>
            librosIds.includes(libro._id)
          );

          setLibrosDetalles(librosFiltrados);
        } else {
          setLibrosDetalles([]);
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.welcomeMessageContainer}>
        <Text style={styles.welcomeText}>Estos son tus libros reservados</Text>
      </View>

      <View style={styles.tarjetasContainer}>
        {librosDetalles.length > 0 ? (
          librosDetalles.map((libro, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cardItem}
              onPress={() => navigation.navigate("DetallesLibro", { book: { ...libro, id: libro._id } })}
            >
              <Image source={{ uri: libro.image }} style={styles.bookCover} />
              <Text style={styles.bookTitleText}>{libro.title}</Text>
              <Text style={styles.bookAuthorText}>{libro.author}</Text>
            </TouchableOpacity>
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
    backgroundColor: "#fff",
  },
  welcomeMessageContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  tarjetasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardItem: {
    width: (width - 60) / 2,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  bookCover: {
    width: "100%",
    height: 150,
    borderRadius: 20,
  },
  bookTitleText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  bookAuthorText: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#888",
  },
  noBooksText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MisLibros;
