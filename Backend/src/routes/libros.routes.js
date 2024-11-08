import { Router } from "express";
import { LibrosController } from "../controllers/libros.controller.js";
import { ControllerLibros } from "../controllers/ControllerLibros.js";

const router = Router();
const libroscontroller = new LibrosController();
const controllerLibros = new ControllerLibros();

router.get("/getlibros", libroscontroller.getlibros); /// para el data seed
router.get("/getlibrosmongo", (req, res) =>
  ControllerLibros.getlibrosMongo(req, res)
);
router.post("/Reservarlibro", (req, res) =>
  ControllerLibros.Reservarlibro(req, res)
);
router.post("/VerReservas", (req, res) =>
  ControllerLibros.VerReservas(req, res)
);
router.get("/VerTodasReservas", (req, res) =>
  ControllerLibros.VerTodasReservas(req, res)
);
router.post("/devolverStock", (req, res) =>
  ControllerLibros.devolverStock(req, res)
);

router.post("/editbooks/:id", libroscontroller.editBooks);
router.post("/createbooks", libroscontroller.createbooks);
router.post("/deletebooks/:id", libroscontroller.deletebooks);
router.get("/getalllibros", libroscontroller.get);

export default router;