// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [
    {
      id: String, // Unique book ID (from external API)
      title: String,
      author: String,
      genre: String,
    },
  ],
  toRead: [
    {
      id: String, // Unique book ID (from external API)
      title: String,
      author: String,
      genre: String,
    },
  ],
});

userSchema.set("timestamps", true);

const User = mongoose.model("User", userSchema);

module.exports = User;
