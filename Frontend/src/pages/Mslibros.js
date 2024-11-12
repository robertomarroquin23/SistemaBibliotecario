import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { Circle } from "react-native-progress";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const MisLibros = ({ navigation }) => {
<<<<<<< HEAD
  const API_URL = "http://192.168.0.8:3000/biblioteca/VerReservas";
  const API_URL2 = "http://192.168.0.8:3000/ObtenerLibros/getlibrosmongo";
=======
  const API_URL = "http://192.168.11.115:3000/biblioteca/VerReservas";
  const API_URL2 = "http://192.168.11.115:3000/ObtenerLibros/getlibrosmongo";
>>>>>>> fb9fbd326f7b57b6519f3fe3a9a457aed9ba59bd

  ///const API_URL = "http://192.168.0.15:3000/biblioteca/VerReservas";
  //const API_URL2 = "http://192.168.0.15:3000/ObtenerLibros/getlibrosmongo";

  const [librosDetalles, setLibrosDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jsonUSER, setJsonUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (jsonUSER) => {
    try {
      setLoading(true);
      const responseReservas = await axios.post(API_URL, {
        userId: jsonUSER.identificacion,
      });
      const reservas = responseReservas.data;

      const librosIds = reservas
        .filter((reserva) => reserva.idAlumno === jsonUSER.identificacion)
        .map((reserva) => reserva.libroId);

      if (librosIds.length > 0) {
        const responseLibros = await axios.get(API_URL2);
        const todosLibros = responseLibros.data;

        const librosFiltrados = todosLibros.filter((libro) =>
          librosIds.includes(libro._id)
        );

        const librosConReservas = librosFiltrados.map((libro) => {
          const reserva = reservas.find(
            (res) =>
              res.libroId === libro._id &&
              res.idAlumno === jsonUSER.identificacion
          );
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
      if (error.response && error.response.status === 404) {
        console.log("El recurso no fue encontrado.");
        setLibrosDetalles([]); // vacio
      } else {
        console.error("Error al cargar las reservas:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const jsonUSER = JSON.parse(userData);
        setJsonUser(jsonUSER);
        await fetchData(jsonUSER);
      } else {
        console.log("No se encontró el usuario en AsyncStorage");
        setLibrosDetalles([]);
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      setLibrosDetalles([]);
    }
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUserData().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

  const calcularTiempoRestante = (fechaDevolucion) => {
    if (!fechaDevolucion) return 0;
    const tiempoRestante = new Date(fechaDevolucion) - new Date();
    return Math.max(0, Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24)));
  };

  if (!jsonUSER) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          Esta es tu lista de libros reservados
        </Text>
      </View>

      <View style={styles.tarjetasContainer}>
        {librosDetalles.length > 0 ? (
          librosDetalles.map((libro, index) => {
            const diasRestantes = calcularTiempoRestante(libro.fechaDevolucion);
            const diasTranscurridos = 15 - diasRestantes;
            const porcentajeRestante = Math.max(
              0,
              Math.min(1, diasTranscurridos / 15)
            );
            const porcentajeTexto = `${diasTranscurridos}/15`;

            return (
              <View key={index} style={styles.cardItem}>
                <TouchableOpacity
                  style={styles.bookContainer}
                  onPress={() =>
                    navigation.navigate("DetallesLibro", {
                      book: { ...libro, id: libro._id },
                    })
                  }
                >
                  <Image
                    source={{ uri: libro.image }}
                    style={styles.bookCover}
                  />
                  <Text style={styles.bookTitleText}>{libro.title}</Text>
                  <Text style={styles.bookAuthorText}>{libro.author}</Text>
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                  <View style={styles.circleContainer}>
                    <Circle
                      progress={porcentajeRestante}
                      size={100}
                      thickness={8}
                      color={diasRestantes > 5 ? "green" : "red"}
                      style={styles.progressCircle}
                    />
                    <Text style={styles.progressText}>{porcentajeTexto}</Text>
                  </View>
                  <Text style={styles.daysRemainingText}>
                    {diasRestantes} días restantes
                  </Text>
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
  messageContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#000000",
    borderBottomRightRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  messageText: {
    color: "#fff",          
    fontSize: 27,
    textAlign: "center",
  }, tarjetasContainer: {
    top: 20,
    alignItems: "center",
    marginBottom: 90,
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
    alignSelf: "center",
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
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  progressCircle: {
    marginTop: 10,
  },
  progressText: {
    position: "absolute",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
