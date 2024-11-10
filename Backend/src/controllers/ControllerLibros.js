import axios from "axios";
import "dotenv/config";
import Books from "../models/libros.models.js";
import Registro from "../models/Registro.models.js";

export class ControllerLibros {
  static async getlibrosMongo(req, res) {
    try {
      const libros = await Books.find();

      if (libros.length === 0) {
        return res.status(404).json({ message: "No se encontraron libros." });
      }

      res.status(200).json(libros);
      console.log("Libros obtenidos correctamente");
    } catch (error) {
      console.error("Error al obtener libros:", error);
      res.status(500).json({ message: "Error al obtener los libros." });
    }
  }

  static async Reservarlibro(req, res) {
    try {
      const { bookId } = req.body;
      const { identificacion } = req.body;
      const { nombre } = req.body;
      const { apellidos } = req.body;

      


     // const idAlumno = "183021";
      console.log("----------------------------------");
      console.log(bookId, identificacion);

      const libro = await Books.findById(bookId);

      if (!libro) {
        console.log("Libro no encontrado");
        return res.status(404).json({ message: "Libro no encontrado" });
      }

      if (libro.stock <= 0) {
        console.log("Libro sin stock");
        return res.status(400).json({ message: "Libro sin stock" });
      }

      libro.stock = libro.stock - 1;
      await libro.save();
      console.log("Libro reservado");

      const nuevoRegistro = new Registro({
        nombre: nombre,
        apellido: apellidos,
        libroId: libro._id,
        idAlumno: identificacion,
        fechaDevolucion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      });

      await nuevoRegistro.save();
      console.log("Registro creado:", nuevoRegistro);

      return res.status(200).json({
        message: "Reserva procesada correctamente",
        libro,
        registro: nuevoRegistro,
        codigoPrestamo: nuevoRegistro.codigoPrestamo,
      });
    } catch (error) {
      console.error("Error en el proceso de reserva:", error);
      return res.status(500).json({ message: "Error al procesar la reserva." });
    }
  }
  static async VerReservas(req, res) {
    try {
      const { idAlumno } = req.body;
      //const reservas = await Registro.find({ idAlumno: idAlumno });
      const reservas = await Registro.find({ estado: "Prestado" });

      if (reservas.length === 0) {
        return res.status(404).json({ message: "No se encontraron reservas." });
      }
      res.status(200).json(reservas);
      console.log("Reservas obtenidas correctamente-----------------");
    } catch (error) {
      console.error("Error al obtener reservas:", error);
      res.status(500).json({ message: "Error al obtener las reservas." });
    }
  }

  static async VerTodasReservas(req, res) {
    try {
      const reservas = await Registro.find({ estado: "Prestado" });

      if (reservas.length === 0) {
        return res.status(404).json({ message: "No se encontraron reservas." });
      }
      res.status(200).json(reservas);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las reservas." });
    }
  }

  static async devolverStock(req, res) {
    try {
      const { codigoPrestamo, libroId } = req.body;

      const busqueda = await Registro.findOne({ codigoPrestamo, libroId });

      if (!busqueda) {
        return res
          .status(404)
          .json({ message: "No se encontró el préstamo o el libro." });
      }
      await Books.findByIdAndUpdate(libroId, { $inc: { stock: 1 } });
      await Registro.findByIdAndUpdate(busqueda._id, { estado: "Devuelto" });
      res.status(200).json({ message: "Stock del libro actualizado correctamente." });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el id del libro." });
    }
  }
}