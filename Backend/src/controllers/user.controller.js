import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // Para hashear la contraseña
import jwt from "jsonwebtoken"; // Para generar el token JWT
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export class UserController {
  // Registro de usuario
  async register(req, res) {
    const { username, email, password, address, phone, personalEmail, birthday } = req.body;

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
        address,
        phone,
        personalEmail,
        birthday,
        roll: 1
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

  async registerAdmin(req, res) {
    const { username, email, password, address, phone, personalEmail, birthday } = req.body;

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
        address,
        phone,
        personalEmail,
        birthday,
        roll: 2
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
          email: user.email,
        },
      };

      // Generar el token JWT
      const token = jwt.sign(payload, "secret_key", { expiresIn: "1h" });

      res.status(200).json({ token, id: payload.user.id });
      var id = payload.user.id;
      console.log("--------------------------------------------------");
      console.log(id);
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

  async useredit(req, res) {
    const {
      username, email, address, phone, personalEmail, birthday
    } = req.body;
    const id = req.params.id;
    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.username = username || user.username;
      user.email = email || user.email;
      user.address = address || user.address;
      user.phone = phone || user.phone;
      user.personalEmail = personalEmail || user.personalEmail;
      user.birthday = birthday || user.birthday;

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async deleteUser(req, res) {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      throw new Error("El usuario no existe");
    }
    try {
      await User.deleteOne({ _id: id });
      return res.status(200).json({ message: "User eliminado" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el user" });
    }
  }

  async getubyid(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("El usuario no existe");
      } else {
        return res.status(200).json(user);
      }
    } catch (error) {
      return res.status(500).json({ error: "Error al buscar el user" });
    }
  }

  async sendEmail(req, res) {
    const USER = process.env.USER;
    const PASS = process.env.PASS;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: USER,
        pass: PASS,
      },
    });

    const { email, code } = req.body;
    try {
      await transporter.sendMail({
        from: USER,
        to: email,
        subject: "Código de verificación",
        text: `Tu código de verificación es: ${code}`,
      });
      res.status(200).json({ message: "Correo enviado correctamente" });
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      res.status(500).json({ message: "Error al enviar el correo", error });
    }
  }

  async updatePass(req, res) {
    const { password } = req.body;
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      user.password = password || user.password;

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      const passwordUpdate = await user.save();
      res.status(200).json(passwordUpdate);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async verifyEmail(req, res) {
    const { email } = req.body;
    try {
      const verify = await User.findOne({ email: email });

      if (!verify) {
        return res
          .status(404)
          .json({ exists: false, message: "El correo no está registrado" });
      }

      res.status(200).json("El correo existe");
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}
