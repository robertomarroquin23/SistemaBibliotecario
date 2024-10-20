import axios from "axios"; 
import "dotenv/config"; 
import Books from "../models/libros.models.js"; 

export class ControllerLibros {
  static async getlibrosMongo(req, res) {
    try {
      const libros = await Books.find(); 

      if (libros.length === 0) {
        return res.status(404).json({ message: "valio verdura" });
      }

      res.status(200).json(libros);
      if(libros.length>0){
        console.log("libros obtenidos correctamente");
        console.log(libros)
      }
    } catch (error) {
      console.error("Error al obtener libros:", error);
      res.status(500).json({ message: "Error al obtener los libros." });
    }
  }
}
