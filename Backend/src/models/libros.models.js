import mongoose from "mongoose";

const isbnSchema = new mongoose.Schema({
  type: {
    type: String,

    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
});

const librosSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,

    minLength: 3,
  },
  image: {
    type: String,
    required: true,

    minLength: 3,
  },
  description: {
    type: String,
    required: true,
  },
  isbn: {
    type: isbnSchema,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
  maturity: {
    type: String,
    required: true,
  },
  previewLink: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

const Books = mongoose.model("books", librosSchema);
export default Books;
