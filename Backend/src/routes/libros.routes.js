import { Router } from "express";
import { LibrosController } from "../controllers/libros.controller.js";

const router = Router();
const libroscontroller = new LibrosController();

router.get("/getlibros", libroscontroller.getlibros);

export default router;
