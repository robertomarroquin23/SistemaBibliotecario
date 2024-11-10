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
import { Circle } from "react-native-progress";
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width } = Dimensions.get("window"); 


const MisLibros = ({ navigation }) => {
  const API_URL = "http://192.168.1.70:3000/biblioteca/VerReservas";
  const API_URL2 = "http://192.168.1.70:3000/ObtenerLibros/getlibrosmongo";
  // API_URL = "http://192.168.1.70:3000/biblioteca/VerReservas";
  //const API_URL2 = "http://192.168.1.70:3000/ObtenerLibros/getlibrosmongo";
  ///const API_URL = "http://192.168.0.15:3000/biblioteca/VerReservas";
  //const API_URL2 = "http://192.168.0.15:3000/ObtenerLibros/getlibrosmongo";X

  const [librosDetalles, setLibrosDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jsonUSER, setJsonUser] = useState(null); 
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
  
        if (userData) {
          const jsonUSER = JSON.parse(userData);
          setJsonUser(jsonUSER);
          console.log("Datos del usuario:", jsonUSER);
          fetchData(jsonUSER); 
        } else {
          console.log("No se encontró el usuario en AsyncStorage");
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };
  
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
              (res) => res.libroId === libro._id && res.idAlumno === jsonUSER.identificacion
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
        console.error("Error al cargar las reservas:", error);
      } finally {
        setLoading(false);
      }
    };
  
    getUserData();
  }, []);  
  
  const calcularTiempoRestante = (fechaDevolucion) => {
    if (!fechaDevolucion) return 0;
    const tiempoRestante = new Date(fechaDevolucion) - new Date();
    const diasRestantes = Math.max(
      0,
      Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24))
    );
    return diasRestantes;
  };
  if (!jsonUSER) {
    return (
      <View>
        <Text>Cargando datos del usuario...</Text>
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

  // const calcularTiempoRestante = (fechaDevolucion) => {
  //   if (!fechaDevolucion) return 0;
  //   const tiempoRestante = new Date(fechaDevolucion) - new Date();
  //   const diasRestantes = Math.max(
  //     0,
  //     Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24))
  //   );
  //   return diasRestantes;
  // };

  return (
    <ScrollView style={styles.scrollContainer}>
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
    width: width * 0.9,
    height: 200,
    backgroundColor: "#e0f7fa",
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    top: 15,
  },
  messageText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00796b",
    textAlign: "center",
  },
  tarjetasContainer: {
    alignItems: "center",
    marginBottom: 70,
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
