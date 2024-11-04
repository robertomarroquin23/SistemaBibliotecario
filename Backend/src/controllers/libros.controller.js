import axios from "axios";
import "dotenv/config";
import Books from "../models/libros.models.js";

const API_KEY = process.env.API_KEY;

export class LibrosController {
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
        description: item.volumeInfo.description || "Sin descripción",
        isbn: item.volumeInfo.industryIdentifiers
          ? {
            type: item.volumeInfo.industryIdentifiers[0].type,
            identifier: item.volumeInfo.industryIdentifiers[0].identifier,
          }
          : { type: "Unknown", identifier: "N/A" },
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

  async editstock(req, res) { }

  async savebooks(req, res) {
    const newProduct = new Products({
      name,
      description,
      price,
      stock,
      categoryid,
      image: `./uploads/${req.file.filename}`,
      update_date: new Date(),
      creation_date: new Date(),
      createdby: userId,
      updatedby: userId,
    });

    const saveProduct = await newProduct.save();
  }
}