import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    minLength: 3,
    trim: true,
  },
});

const User = mongoose.model("user", userSchema);
export default User;
