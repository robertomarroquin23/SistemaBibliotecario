import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";

const LibraryScreen = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [categories, setCategories] = useState("");
  const [maturity, setMaturity] = useState("");
  const [previewLink, setPreviewLink] = useState("");
  const [stock, setStock] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.4:3000/ObtenerLibros/getlibrosmongo"
      );
      setBooks(response.data);
    } catch (error) {
      console.error("Error al cargar los libros:", error);
      alert("Hubo un error al cargar los libros");
    }
  };

  const validateFields = () => {
    if (!title || !author || !image) {
      Alert.alert(
        "Error",
        "Por favor, complete los campos obligatorios: Título, Autor e Imagen"
      );
      return false;
    }
    return true;
  };
  const confirmDeleteBook = (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Está seguro de que desea eliminar este libro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => handleDeleteBook(id),
          style: "destructive",
        },
      ]
    );
  };

  const handleDeleteBook = async (id) => {
    try {
      const response = await axios.post(
        `http://192.168.0.4:3000/biblioteca/deletebooks/${id}`
      );
      Alert.alert("Éxito", "Libro eliminado");
      fetchBooks();
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
      alert("Hubo un error al eliminar el libro");
    }
  };

  const handleAddBook = async () => {
    if (!validateFields()) return;
    try {
      await axios.post("http://192.168.0.4:3000/biblioteca/createbooks", {
        title,
        author,
        image,
        description,
        isbn: {
          type: isbn.type,
          identifier: isbn.identifier,
        },
        categories,
        maturity,
        previewLink,
        stock,
      });
      Alert.alert("Éxito", "Libro agregado exitosamente");
      setModalVisible(false);
      fetchBooks();
      resetFields();
    } catch (error) {
      console.error("Error al agregar el libro:", error);
      alert("Hubo un error al agregar el libro");
    }
  };
  const handleEditBook = (book) => {
    setSelectedBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setImage(book.image);
    setDescription(book.description);
    setIsbn(book.isbn);
    setCategories(book.categories);
    setMaturity(book.maturity);
    setPreviewLink(book.previewLink);
    setStock(book.stock);
    setModalVisible(true);
  };

  const handleSaveEditBook = async () => {
    if (!validateFields()) return;
    try {
      await axios.post(
        `http://192.168.10.138:3000/biblioteca/editBooks/${selectedBook._id}`,
        {
          title,
          author,
          image,
          description,
          isbn,
          categories,
          maturity,
          previewLink,
          stock,
        }
      );
      Alert.alert("Éxito", "Libro modificado exitosamente");
      setModalVisible(false);
      fetchBooks();
      resetFields();
    } catch (error) {
      console.error("Error al modificar el libro:", error);
      alert("Hubo un error al modificar el libro");
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  const resetFields = () => {
    setTitle("");
    setAuthor("");
    setImage("");
    setDescription("");
    setIsbn({ type: "", identifier: "" });
    setCategories("");
    setMaturity("");
    setPreviewLink("");
    setStock(0);
    setSelectedBook(null);
  };

  const handleCloseModal = () => {
    resetFields();
    setModalVisible(false);
  };

  const handleStockChange = (text) => {
    const parsedStock = parseInt(text, 10);
    setStock(Number.isNaN(parsedStock) ? 0 : parsedStock);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biblioteca ITCA-FEPADE</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar libro..."
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Agregar Libro</Text>
      </TouchableOpacity>

      <FlatList
        data={books.filter((book) =>
          book.title.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>Autor: {item.author}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditBook(item)}
              >
                <Text style={styles.buttonText}>Modificar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDeleteBook(item._id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
        numColumns={2}
      />

      <Text style={styles.pagination}>{`Total libros: ${books.length}`}</Text>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedBook ? "Modificar Libro" : "Ingresar Libro"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Autor"
              value={author}
              onChangeText={setAuthor}
            />
            <TextInput
              style={styles.input}
              placeholder="URL de la imagen"
              value={image}
              onChangeText={setImage}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Tipo de ISBN (por ejemplo, ISBN_10)"
              value={isbn.type}
              onChangeText={(text) => setIsbn({ ...isbn, type: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Identificador ISBN"
              value={isbn.identifier}
              onChangeText={(text) => setIsbn({ ...isbn, identifier: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Categorías"
              value={categories}
              onChangeText={setCategories}
            />
            <TextInput
              style={styles.input}
              placeholder="Maturidad"
              value={maturity}
              onChangeText={setMaturity}
            />
            <TextInput
              style={styles.input}
              placeholder="Enlace de previsualización"
              value={previewLink}
              onChangeText={setPreviewLink}
            />
            <TextInput
              style={styles.input}
              placeholder="Stock"
              value={stock.toString()}
              keyboardType="numeric"
              onChangeText={handleStockChange}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={selectedBook ? handleSaveEditBook : handleAddBook}
            >
              <Text style={styles.buttonText}>
                {selectedBook ? "Guardar Cambios" : "Agregar Libro"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#FFD700",
    padding: 5,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: 5,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 10,
    marginTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5D4037",
    textAlign: "center",
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: "45%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  bookImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },

  bookAuthor: { color: "#666", textAlign: "center" },
  pagination: {
    textAlign: "center",
    fontSize: 16,
    color: "#5D4037",
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 350,
    marginTop: 80,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#5D4037",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: "#BDBDBD",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
});

export default LibraryScreen;
