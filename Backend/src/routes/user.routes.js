import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();
const userController = new UserController();

router.get("/geto", userController.userget);
router.post("/newUser", userController.usercreate);
export default router;
