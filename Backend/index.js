import express from "express";
import userRoutes from "./src/routes/user.routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB", err);
  });

app.use("/biblioteca/", userRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));
