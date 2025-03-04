const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [
    {
      id: String,
      title: String,
      author: String,
      genre: String,
      image: String,
    },
  ],
  toRead: [
    {
      id: String,
      title: String,
      author: String,
      genre: String,
      image: String,
    },
  ],
});

userSchema.set("timestamps", true);

const User = mongoose.model("user", userSchema);

module.exports = User;
