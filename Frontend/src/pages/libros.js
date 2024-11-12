import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Libros = ({ navigation }) => {
  const API_URL = "http://192.168.11.160:3000/ObtenerLibros/getlibrosmongo";
 // const API_URL = "http://192.168.0.4:3000/ObtenerLibros/getlibrosmongo";
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState(new Set(["Todos", "Ficción", "No Ficción", "Infantil", "Misterio"]));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(API_URL);
        const fetchedBooks = response.data;
        setBooks(fetchedBooks);
        setFilteredBooks(fetchedBooks); 

        const uniqueCategories = new Set(["Todos"]);
        fetchedBooks.forEach((book) => {
          if (book.categories) {
            uniqueCategories.add(book.categories);
          }
        });
        setCategories(uniqueCategories);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error("Sucedió un error:", error);
      }
    };

    fetchBooks();
  }, []);

  const filterBooks = (text) => {
    setSearchTerm(text);
    if (text) {
      const filter = books.filter((book) =>
        book.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBooks(filter); 
    } else {
      setFilteredBooks(books); 
    }
  };

  const filterBooksByCategory = (category) => {
    if (category === "Todos") {
      setFilteredBooks(books); 
    } else {
      const filtered = books.filter((book) => book.categories === category);
      setFilteredBooks(filtered);
    }
  };

  return (
    <Animated.ScrollView style={[styles.scrollContainer, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        
        <Text style={styles.headerName}>Hola, Samuel</Text>
        <Text style={styles.headerText}>The best{"\n"}books for you!!!</Text>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={24}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Qué buscas hoy"
            onChangeText={filterBooks} 
            value={searchTerm}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {[...categories].map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryButton} onPress={() => filterBooksByCategory(category)}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.booksTitle}>Libros</Text>

      <View style={styles.container}>
        {filteredBooks.map((book, index) => (
          <Animated.View
            key={index}
            style={[
              styles.cardItem,
              {
                transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
              },
            ]}
          >
            <TouchableOpacity
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
          </Animated.View>
        ))}
      </View>
    </Animated.ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
    color: "#7a7e7f",
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    width: "100%",
    marginTop: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 18,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingLeft: 10,
  },
  categoryButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  booksTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  container: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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

export default Libros;
