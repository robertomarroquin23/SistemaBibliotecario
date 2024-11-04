import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Dirección del usuario
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
  },
  // Teléfono del usuario
  phone: {
    type: String,
    trim: true,
  },
  // Carrera del usuario
  career: {
    type: String,
    trim: true,
  },
  // Correo personal del usuario
  personalEmail: {
    type: String,
    trim: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);
export default User;
