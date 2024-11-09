import express from "express";
import userRoutes from "./src/routes/user.routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// O, si prefieres permitir solo un origen específico
app.use(cors({
  origin: 'http://localhost:8081'
}));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB", err);
  });

app.use("/biblioteca/", userRoutes);

// Ejemplo de ruta
app.post('/api/login', (req, res) => {
  // Tu lógica de login
  res.json({ message: 'Inicio de sesión exitoso', token: 'token_jwt' });
});

app.post('/api/register', (req, res) => {
  // Tu lógica de login
  res.json({ message: 'Inicio de sesión exitoso', token: 'token_jwt', });
});




app.listen(port, () => console.log(`app listening on port ${port}`));
