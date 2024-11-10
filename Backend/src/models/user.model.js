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
  fechaNacimiento: {
    type: Date,
    required: true,
  },
  ciudad: {
    type: String,
    required: true,
  },
  carnet: {
    type: String,
    required: true,
    unique: true,
  },
  carrera: {
    type: String,
    required: true,
  },
  anioIngreso: {
    type: Number,
    required: true,
  },
  facultad: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  pais: {
    type: String,
    required: true,
  },
  identificacion: {
    type: String,
    required: true,
    unique: true,
  },
  ///1 pa estudiante 2 pa profesor o admin 
  roll: {
    type: Number,
    
      enum: [1, 2], 
    
    
  },
});

const User = mongoose.model("User", userSchema);
export default User;
