// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  toRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

userSchema.set("timestamps", true);

const User = mongoose.model("User", userSchema);

module.exports = User;
