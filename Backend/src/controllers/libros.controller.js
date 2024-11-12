import axios from "axios";
import "dotenv/config";
import Books from "../models/libros.models.js";

const API_KEY = process.env.API_KEY;

export class LibrosController {
  async get(req, res) {
    const libros = await Books.find();
    console.log(libros);
    return res.status(200).json(libros);
  }

  async getlibros(req, res) {
    const categoriesArray = [
      "fiction",
      "action",
      "horror",
      "magic",
      "religion",
    ];

    // const categoriesArray = "fiction";
    //const maxResults = 10;
    const categoriesQuery = categoriesArray
      .map((category) => `${category}`)
      .join("+AND+");
    const maxResults = 40;
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${categoriesQuery}&langRestrict=es&maxResults=${maxResults}&key=${API_KEY}`
      );
      const fetchedbooks = response.data.items.map((item) => ({
        title: item.volumeInfo.title || "Sin título",
        author: item.volumeInfo.authors
          ? item.volumeInfo.authors[0]
          : "Autor desconocido",
        image: item.volumeInfo.imageLinks
          ? item.volumeInfo.imageLinks.thumbnail
          : "https://example.com/default.jpg",
        description: item.volumeInfo.description
          ? item.volumeInfo.description
          : "Sin descripcion",
          isbn: item.volumeInfo?.industryIdentifiers?.[0] || "",
        categories: item.volumeInfo.categories
          ? item.volumeInfo.categories[0]
          : "Sin categoría",
        maturity: item.volumeInfo.maturityRating || "No disponible",
        previewlink: item.volumeInfo.previewLink || "no_disponible",
      }));

      fetchedbooks.forEach(async (book, index) => {
        let stock = 0;

        const crearlibro = new Books({
          title: book.title,
          author: book.author,
          image: book.image,
          description: book.description,
          isbn: book.isbn,
          categories: book.categories,
          maturity: book.maturity,
          previewLink: book.previewlink,
          stock: (stock = getRandomInt(1, 10)),
        });
        // console.log("link del libro");
        // console.log(book.previewLink);
        const saveBooks = await crearlibro.save();
      });

      res.status(200).json(fetchedbooks);
    } catch (error) {
      res.status(500).json(error, "cagada");
    }
  }

  async editBooks(req, res) {
    const id = req.params.id;
    const {
      title,
      author,
      image,
      description,
      isbn,
      categories,
      maturity,
      previewLink,
      stock,
    } = req.body;

    const edition = await Books.findById(id);

    try {
      edition.title = title || edition.title;
      edition.author = author || edition.author;
      edition.image = image || edition.image;
      edition.description = description || edition.description;
      edition.isbn = isbn || edition.isbn;
      edition.categories = categories || edition.categories;
      edition.maturity = maturity || edition.maturity;
      edition.previewLink = previewLink || edition.previewLink;
      edition.stock = stock || edition.stock;
      edition.maturity = maturity || edition.maturity;
      edition.previewLink = previewLink || edition.previewLink;
      edition.stock = stock || edition.stock;
      await edition.save();
      res.status(200).json(edition);
    } catch (error) {
      res.status(500).json({ error: "Error al editar el producto" });
    }
  }

  async createbooks(req, res) {
    const {
      title,
      author,
      image,
      description,
      isbn,
      categories,
      maturity,
      previewLink,
      stock,
    } = req.body;

    try {
      const crearlibro = new Books({
        title: title,
        author: author,
        image: image,
        description: description,
        isbn: isbn,
        categories: categories,
        maturity: maturity,
        previewLink: previewLink,
        stock: stock,
      });

      const saveBooks = await crearlibro.save();
      res.status(200).json(saveBooks);
    } catch (error) {
      res.status(500).json(error, "no messi");
    }
  }

  async deletebooks(req, res) {
    try {
      const { id } = req.params;
      const deletedBook = await Books.findByIdAndDelete(id);
      if (!deletedBook) {
        return res.status(404).json({ message: "Libro no encontrado" });
      }
      return res.status(200).json({ message: "Libro eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
      return res.status(500).json({ message: "Error al eliminar el libro" });
    }
}
}
