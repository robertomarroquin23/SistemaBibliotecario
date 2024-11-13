import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import axios from "axios";
import React, { useState, useEffect } from "react";

import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetallesLibro = ({ route, navigation }) => {
  const { book } = route.params;
  const isAvailable = book.stock > 0;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isTicketModalVisible, setTicketModalVisible] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [jsonUSER, setJsonUser] = useState(null); 

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setJsonUser(parsedData); 
          console.log("Datos del usuario:", parsedData);
        } else {
          console.log("No se encontró el usuario en AsyncStorage");
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    getUserData();
  }, []);

  const API_URL = "http://192.168.11.160:3000/biblioteca/Reservarlibro";
  //const API_URL = "http://192.168.1.70:3000/biblioteca/Reservarlibro";


  const handleReserve = async () => {
    if (!jsonUSER || !jsonUSER._id) {
      console.error("No se encontraron datos de usuario válidos para reservar");
      return;
    }
    
    try {
      const response = await axios.post(API_URL, {
        bookId: book.id,
        identificacion: jsonUSER._id,
        nombre: jsonUSER.username,
      //  apellidos: jsonUSER.apellidos || "",
        
      });

      if (response.status === 200) {
        setTicketData(response.data);
        setShowDownloadButton(true);
      } else {
        console.log("Error al reservar:", response.data);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    } finally {
      toggleModal();
    }
  };

  const handleDownloadPDF = async () => {
    const htmlContent = `<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0; 
      padding: 20px; 
      background-color: #f7f7f7; 
    }
    .ticket {
      background-color: #ffffff;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      text-align: center;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
    }
    .qr-code {
      text-align: center;
      margin-top: 20px;
    }
    img {
      width: 150px; 
      height: 150px; 
    }
  </style>
</head>
<body>
  <div class="ticket">
    <h1>Ticket de Reserva</h1>
    <table>
      <tr>
        <th>Detalle</th>
        <th>Información</th>
      </tr>
      <tr>
        <td>Libro</td>
        <td>${ticketData?.libro.title}</td>
      </tr>
      <tr>
        <td>Autor</td>
        <td>${ticketData?.libro.author}</td>
      </tr>
      <tr>
        <td>Fecha de Reserva</td>
        <td>${new Date().toLocaleDateString()}</td>
      </tr>
      <tr>
        <td>ID de Reserva</td>
        <td>${ticketData?._id}</td>
      </tr>
     
      <tr>
        <td>ID de Alumno</td>
        <td>${jsonUSER?.identificacion}</td> <!-- Usar datos del localStorage -->
      </tr>
      <tr>
        <td>Usuario</td>
        <td>${jsonUSER?.username}</td> <!-- Usar datos del localStorage -->
      </tr>
    </table>
    <div class="footer">
      <p>ITCA-FEPADE</p>
      <p>Departamento de La Libertad, Santa Tecla</p>
    </div>
    <div class="qr-code">
      <h2>Escanea el código QR para más información</h2>
      <img src="https://api.qrserver.com/v1/create-qr-code/?data=https://www.itca.edu.sv/&size=150x150" alt="Código QR ITCA">
    </div>
  </div>
</body>
</html> 
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await shareAsync(uri);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.heartButton}>
          <Icon name="favorite-border" size={20} color="#FF0000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>Título de la Pantalla</Text>

      <Text style={styles.genre}>{book.categories}</Text>
      <View style={styles.detailsContainer}>
        <Image source={{ uri: book.image }} style={styles.bookImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>By {book.author}</Text>
          <Text style={styles.stockText}>
            Disponibilidad: {isAvailable ? "Disponible" : "No Disponible"} (
            {book.stock} en stock)
          </Text>
          {isAvailable && (
            <TouchableOpacity
              style={styles.reserveButton}
              onPress={toggleModal}
            >
              <Icon name="event" size={20} color="#fff" />
              <Text style={styles.buttonText}>Reservar</Text>
            </TouchableOpacity>
          )}
          {showDownloadButton && (
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => setTicketModalVisible(true)}
        >
          <Text style={styles.buttonText}>Ver Ticket de Reserva</Text>
        </TouchableOpacity>
      )}

        </View>
        
      </View>

      <Text style={styles.descriptionTitle}>Descripción</Text>
      <Text style={styles.description}>{book.description}</Text>

      

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Image source={{ uri: book.image }} style={styles.modalImage} />
          <Text style={styles.modalTitle}>{book.title}</Text>
          <Text style={styles.modalText}>Tiempo de préstamo: 15 días</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.acceptButton]}
              onPress={handleReserve}
            >
              <Text style={styles.buttonText}>Prestar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={isTicketModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ticket de Reserva</Text>
          <Text>Libro: {ticketData?.libro.title}</Text>
          <Text>Autor: {ticketData?.libro.author}</Text>
          <Text>Fecha de Reserva: {new Date().toLocaleDateString()}</Text>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadPDF}
          >
            <Text style={styles.buttonText}>Descargar Ticket en PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setTicketModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    position: "absolute",
    top: 10,
    width: "100%",
    zIndex: 1,
  },
  backButton: {
    padding: 10,
  },
  heartButton: {
    padding: 10,
  },
  genre: {
    fontSize: 26,
    top: 20,
    color: "#000",
    textAlign: "center",
    marginVertical: 10,
    width: "100%",
    paddingVertical: 5,
    fontWeight: "bold",
  },
  detailsContainer: {
    flexDirection: "row",
    marginVertical: 20,
    alignItems: "flex-start",
    paddingHorizontal: 15,
  },
  bookImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  author: {
    fontSize: 16,
    marginBottom: 10,
  },
  stockText: {
    fontSize: 16,
    color: "green",
  },
  reserveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  descriptionTitle: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 15,
  },
  downloadButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    height: "30%",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  modalButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DetallesLibro;
