import User from "../models/user.model.js";

export class UserController {
  async usercreate(req, res) {
    const { username } = req.body;
    try {
      const newuser = new User({
        username,
      });
      await newuser.save();
      res.status(200).json(newuser);
    } catch (error) {
      res.status(500).json("Error capa8");
    }
  }

  async userget(req, res) {
    try {
      const users = await User.find();

      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json("pedillos 2");
    }
  }
}
