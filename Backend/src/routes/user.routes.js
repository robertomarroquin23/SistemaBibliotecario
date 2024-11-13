import express from "express";
import { UserController } from "../controllers/user.controller.js";

const router = express.Router();
const userController = new UserController();

// Ruta de registro
router.post("/register", (req, res) => userController.register(req, res));
router.post("/registerAdmin", (req, res) => userController.registerAdmin(req, res));

// Ruta de login
router.post("/login", (req, res) => userController.login(req, res));

// Ruta para obtener todos los usuarios
router.get("/users", (req, res) => userController.userget(req, res));

router.post("/sendEmail", userController.sendEmail);
router.post("/verifyEmail", userController.verifyEmail);

router.put("/updatePass/:id", userController.updatePass);
router.post("/edituser/:id", userController.useredit);
router.post("/deleteuser/:id", userController.deleteUser);
router.get("/getbyid/:id", userController.getubyid);

export default router;