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
import { Circle } from 'react-native-progress';

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

          const librosConReservas = librosFiltrados.map(libro => {
            const reserva = reservas.find(res => res.libroId === libro._id && res.idAlumno === "183021");
            return {
              ...libro,
              fechaDevolucion: reserva ? reserva.fechaDevolucion : null,
            };
          });

          setLibrosDetalles(librosConReservas);
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

  const calcularTiempoRestante = (fechaDevolucion) => {
    if (!fechaDevolucion) return 0;
    const tiempoRestante = new Date(fechaDevolucion) - new Date();
    const diasRestantes = Math.max(0, Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24)));
    return diasRestantes;
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.welcomeMessageContainer}>
        <Text style={styles.welcomeText}>Estos son tus libros reservados</Text>
      </View>

      <View style={styles.tarjetasContainer}>
        {librosDetalles.length > 0 ? (
          librosDetalles.map((libro, index) => {
            const diasRestantes = calcularTiempoRestante(libro.fechaDevolucion);
            const porcentajeRestante = Math.max(0, Math.min(1, diasRestantes / 15));
            const porcentajeTexto = diasRestantes ? `${diasRestantes}/15` : "0/15";

            return (
              <View key={index} style={styles.cardItem}>
                <TouchableOpacity
                  style={styles.bookContainer}
                  onPress={() => navigation.navigate("DetallesLibro", { book: { ...libro, id: libro._id } })}
                >
                  <Image source={{ uri: libro.image }} style={styles.bookCover} />
                  <Text style={styles.bookTitleText}>{libro.title}</Text>
                  <Text style={styles.bookAuthorText}>{libro.author}</Text>
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                  <View style={styles.circleContainer}>
                    <Circle
                      progress={porcentajeRestante}
                      size={100}
                      thickness={8}
                      color={porcentajeRestante > 0.5 ? "green" : "red"}
                      style={styles.progressCircle}
                    />
                    <Text style={styles.progressText}>{porcentajeTexto}</Text> 
                                     </View>
                  <Text style={styles.daysRemainingText}>{diasRestantes} días restantes</Text>
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
    flexDirection: "row",
    alignItems: "center",
    width: width - 40,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  bookContainer: {
    flex: 1,
    marginRight: 15,
    alignItems: "flex-start",
  },
  bookCover: {
    width: 70,
    height: 100,
    borderRadius: 10,
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
  progressContainer: {
    alignItems: "center",
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    marginTop: 10,
  },
  progressText: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  daysRemainingText: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
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
