import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const categories = [
  { title: "Programación", icon: "laptop", color: "#ff6f61" },
  { title: "Arquitectura", icon: "home", color: "#ffcc33" },
  { title: "Cocina", icon: "restaurant", color: "#66ff66" },
  { title: "Historia", icon: "book", color: "#33ccff" },
];

const colors = [
  "#ff007f",
  "#39ff14",
  "#00f0ff",
  "#eaff00",
  "#ff5f00",
  "#8a2be2",
  "#ff3f3f",
  "#00cfc1",
  "#b2ff00",
  "#ff77ff",
];
//aqui poner simpre la ip de la maquina no local ni 127.0.0.1 si les da un network error corrar ipconfig en la terminal y cambien la ip
//const API_URL = "http://192.168.1.63:3000/ObtenerLibros/getlibrosmongo"; 192.168.0.15:3000

const API_URL = "http://192.168.10.138:3000/ObtenerLibros/getlibrosmongo";

{
  /*const recommendedBooks = [
  {
    title: "El Arte de Programar",
    author: "Donald Knuth",
    image: "https://via.placeholder.com/60x90",
  },
  {
    title: "La Magia de Pensar en Grande",
    author: "David J. Schwartz",
    image: "https://via.placeholder.com/60x90",
  },
  {
    title: "Cien Años de Soledad",
    author: "Gabriel García Márquez",
    image: "https://via.placeholder.com/60x90",
  },
  {
    title: "Los Pilares de la Tierra",
    author: "Ken Follett",
    image: "https://via.placeholder.com/60x90",
  },
  {
    title: "1984",
    author: "George Orwell",
    image: "https://via.placeholder.com/60x90",
  },
  {
    title: "Orgullo y Prejuicio",
    author: "Jane Austen",
    image: "https://via.placeholder.com/60x90",
  },
];*/
}

const Principal = ({ navigation }) => {
  const [jsonUSER, setJsonUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [librosDetalles, setLibrosDetalles] = useState([]);

  const [books, setbooks] = useState([]);
  const colorAnimation = useRef(new Animated.Value(0)).current;
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const animatedValues = useRef(books.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const colorCount = colors.length;
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnimation, {
          toValue: colorCount - 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [colorAnimation]);

  {
    /* useEffect(async () => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=random&key=${API_KEY}`
        );
        const fetchedbooks = response.data.items.map((item) => ({
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors
            ? item.volumeInfo.authors[0]
            : "Autor desconocido",
          image: item.volumeInfo.imageLinks
            ? item.volumeInfo.imageLinks.thumbnail
            : "https://example.com/default.jpg",
        }));
        setbooks(fetchedbooks);
      } catch (error) {
        console.error("Error al obtener libros:", error);
      }
    };

    fetchData();
  }, []);*/
  }
  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
        const jsonUSER = JSON.parse(userData);
        setJsonUser(jsonUSER);
        console.log("Datos del usuario:", jsonUSER);
      } else {
        console.log("No se encontró el usuario en AsyncStorage");
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  ///funcion para obtener los libros
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(API_URL);
        setbooks(response.data.slice(0, 20)); //20 libros
        setRecommendedBooks(response.data.slice(0, 5)); // 5 libros
      } catch (error) {
        console.error("sucedio un error :", error);
      }
    };
    getUserData();

    fetchBooks();
  }, []);

  {
    /* const Books = [
    {
      title: "Libro 1",
      author: "Autor 1",
      image: "https://via.placeholder.com/60x90",
    },
    {
      title: "Libro 2",
      author: "Autor 2",
      image: "https://via.placeholder.com/60x90",
    },
    {
      title: "Libro 3",
      author: "Autor 3",
      image: "https://via.placeholder.com/60x90",
    },
    {
      title: "Libro 4",
      author: "Autor 4",
      image: "https://via.placeholder.com/60x90",
    },
    {
      title: "Libro 5",
      author: "Autor 5",
      image: "https://via.placeholder.com/60x90",
    },
    {
      title: "Libro 6",
      author: "Autor 6",
      image: "https://via.placeholder.com/60x90",
    },
    {
      title: "Libro 7",
      author: "Autor 7",
      image: "https://via.placeholder.com/60x90",
    },
    {
      title: "Libro 8",
      author: "Autor 8",
      image: "https://via.placeholder.com/60x90",
    },
    {
      title: "Libro 9",
      author: "Autor 9",
      image: "https://via.placeholder.com/60x90",
    },
    {
      title: "Libro 10",
      author: "Autor 9",
      image: "https://via.placeholder.com/60x90",
    },
  ];*/
  }

  const backgroundColorInterpolate = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors[0], colors[colors.length - 1]],
    extrapolate: "clamp",
  });
  //no lo borren sino les dara errro
  if (!jsonUSER) {
    return (
      <View>
        <Text>Cargando datos del usuario...</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.header}>
        <View style={styles.container}>
          <View style={styles.containeriIcons}>
            <Image
              source={{ uri: "https://picsum.photos/40/40" }}
              style={styles.userImage}
            />

            <View style={styles.bellIconContainer}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.notificationBadge} />
            </View>
          </View>
        </View>

        <Text style={styles.headerName}>Hola, {jsonUSER.username}</Text>
        <Text style={styles.headerText}>Bienvenido {"\n"}otra vez!!!</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.tarjetasContainer}>
          <Text style={styles.title}>Libro de la semana</Text>

          <Animated.View
            style={[
              styles.bookCard,
              { backgroundColor: backgroundColorInterpolate },
            ]}
          >
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>El Arte de Programar</Text>
              <Text style={styles.bookAuthor}>por Donald Knuth</Text>
            </View>
            <Image
              source={{ uri: "https://via.placeholder.com/80x120" }}
              style={styles.bookImage}
            />
          </Animated.View>
        </View>

        <View style={styles.carouselContainer}>
          <Text style={styles.carouselTitle}>Recomendados para ti</Text>
          <Swiper
            style={styles.swiper}
            showsButtons={false}
            autoplay={true}
            autoplayTimeout={3}
            loop={true}
            paginationStyle={styles.hiddenPagination}
            dotStyle={styles.hiddenDotStyle}
            activeDotStyle={styles.hiddenActiveDotStyle}
          >
            {recommendedBooks.map((book, index) => (
              <View key={index} style={styles.slide}>
                <View style={styles.bookDetails}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>por {book.author}</Text>
                </View>
                <Image source={{ uri: book.image }} style={styles.bookImage} />
              </View>
            ))}
          </Swiper>

          <Text style={styles.texta}>Tambien podria Gustarte</Text>
        </View>
        <View style={styles.container}>
          {books.map((book, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cardItem}
              onPress={() => {
                navigation.navigate("DetallesLibro", {
                  book: {
                    ...book,
                    id: book._id,
                    categories: book.categories,
                  },
                });
              }}
            >
              <Image source={{ uri: book.image }} style={styles.bookCover} />
              <Text style={styles.bookTitleText}>{book.title}</Text>
              <Text style={styles.bookAuthorText}>{book.author}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 300,
    backgroundColor: "#000000",
    borderBottomRightRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerName: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    top: -90,
  },
  headerText: {
    color: "#7a7e7f",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    alignSelf: "flex-start",
    top: -90,
  },
  containeriIcons: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },

  userImage: {
    top: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 260,
  },
  bellIconContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  welcomeMessageContainer: {
    position: "absolute",
    top: 35,
    left: 25,
    right: 20,
    alignItems: "center",
  },
  welcomeText: {
    top: 20,
    fontSize: 45,
    fontWeight: "bold",
    left: -50,
  },
  welcomeTexth: {
    top: 20,
    fontSize: 45,
    fontWeight: "bold",
    left: -30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 205,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 18,
    width: "100%",
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  card: {
    width: (width - 50) / 2,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  cardIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  tarjetasContainer: {
    flexDirection: "column",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width - 40,
    height: 150,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  bookImage: {
    width: 100,
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  carouselContainer: {
    marginTop: 20,
  },
  carouselTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  swiper: {
    height: 150,
  },
  slide: {
    width: width * 0.8,
    height: 150,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#d1f4ff",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  bookDetails: {
    flex: 1,
    alignItems: "flex-start",
    marginRight: 10,
  },
  hiddenPagination: {
    display: "none",
  },
  hiddenDotStyle: {
    display: "none",
  },
  hiddenActiveDotStyle: {
    display: "none",
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#888",
  },
  container: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: (width - 50) / 2,
    height: 250,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  cardtipo: {
    width: (width - 50) / 2,
    height: 100,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 5,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  texta: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  cardItem: {
    width: (width - 50) / 2,
    height: 280,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
  bookCover: {
    width: "95%",
    height: "80%",
    position: "absolute",
    top: 0,
  },
  bookTitleText: {
    marginTop: 225,
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 10,
  },
  bookAuthorText: {
    fontSize: 14,
    color: "#777",
    paddingHorizontal: 10,
  },
});

export default Principal;
