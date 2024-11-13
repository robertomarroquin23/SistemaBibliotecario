import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // Para hashear la contraseña
import jwt from "jsonwebtoken"; // Para generar el token JWT

export class UserController {

  // Registro de usuario
  async register(req, res) {
    const { username, email, password } = req.body;

    try {
      // Verificar si el usuario ya existe
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "El usuario ya existe" });
      }

      // Crear un nuevo usuario
      const newUser = new User({
        username,
        email,
        password,
      });

      // Hashear la contraseña antes de guardar
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      // Guardar en la base de datos
      await newUser.save();
      res.status(201).json({ msg: "Usuario registrado exitosamente" });
    } catch (error) {
      res.status(500).json({ msg: "Error de servidor", error });
    }
  }

  // Login de usuario
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Verificar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Credenciales incorrectas" });
      }

      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Credenciales incorrectas" });
      }

      // Crear un payload para el token
      const payload = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
      };

      // Generar el token JWT
      const token = jwt.sign(payload, "secret_key", { expiresIn: "1h" });

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ msg: "Error de servidor", error });
    }
  }

  // Obtener todos los usuarios
  async userget(req, res) {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ msg: "Error de servidor", error });
    }
  }

  // Crear usuario (sin contraseña)
  async usercreate(req, res) {
    const { username } = req.body;
    try {
      const newUser = new User({
        username,
      });
      await newUser.save();
      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json({ msg: "Error de servidor", error });
    }
  }
}
