import express from "express";
import userRoutes from "./src/routes/user.routes.js";
import librosRoutes from "./src/routes/libros.routes.js";
import mongoose from "mongoose";

import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
async function cargarLibrosMongo() {
  console.log("el diablo.");
  app.use("/biblioteca/getlibros", librosRoutes);

  try {
    //en el .env cambien lo mamada del localhost si usan docker
    const response = await axios.get(
      `${process.env.BASE_URL}/ObtenerLibros/getlibrosmongo`
    );
    //console.log("Respuesta de la ruta:", response.data);
  } catch (error) {
    console.error("Error al hacer la petición:", error);
  }
}

// O, si prefieres permitir solo un origen específico
app.use(
  cors({
    origin: "http://localhost:8081",
  })
);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    cargarLibrosMongo();
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB", err);
  });
///primero llenen los libros en mongo si usan lo mismo que lo mio la base se llama:Proyectofinalmoviles
//sgundo llenen la base:http://localhost:3000/biblioteca/getlibros/getlibros
///ejecuten eso en el thunderclient es en get no pongan nad amas solo el link y sha
//despues de eso vuelvana reiniciar el cierren el npm start y tendria que imprimirles los libros de moongo en consola el solo en formato json
app.use("/biblioteca", librosRoutes);
app.use("/biblioteca/", userRoutes);
app.use("/ObtenerLibros", librosRoutes);
app.use("/biblioteca/getlibros", librosRoutes);
app.use("/biblioteca/VerReservas", librosRoutes);

// Ejemplo de ruta
app.post("/api/login", (req, res) => {
  // Tu lógica de login
  res.json({ message: "Inicio de sesión exitoso", token: "token_jwt" });
});

app.listen(port, () => console.log(`app listening on port ${port}`));
