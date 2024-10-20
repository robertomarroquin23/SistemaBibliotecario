import express from "express";
import { UserController } from "../controllers/user.controller.js";

const router = express.Router();
const userController = new UserController();

// Ruta de registro
router.post("/register", (req, res) => userController.register(req, res));

// Ruta de login
router.post("/login", (req, res) => userController.login(req, res));

// Ruta para obtener todos los usuarios
router.get("/users", (req, res) => userController.userget(req, res));

export default router;
