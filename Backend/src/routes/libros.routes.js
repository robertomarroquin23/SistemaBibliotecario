import { Router } from "express";
import { LibrosController } from "../controllers/libros.controller.js";
import { ControllerLibros } from "../controllers/ControllerLibros.js";

const router = Router();
const libroscontroller = new LibrosController();
const controllerLibros = new ControllerLibros();

router.get("/getlibros", libroscontroller.getlibros);
router.get("/getlibrosmongo", (req, res) => ControllerLibros.getlibrosMongo(req, res));
router.post("/Reservarlibro", (req, res) => ControllerLibros.Reservarlibro(req, res));
router.post("/VerReservas", (req, res) => ControllerLibros.VerReservas(req, res));



export default router;
