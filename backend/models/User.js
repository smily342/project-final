import mongoose from "mongoose";

// Schema for users
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true }, // User's first name
  lastName: { type: String, required: true },  // User's last name
  username: { type: String, required: true, unique: true }, // Unique username
  email: { type: String, required: true, unique: true },    // Unique email
  password: { type: String, required: true },              // Hashed password
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }], // Favorite books
  toRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],    // Books to read
});

const User = mongoose.model("User", userSchema);

export default User;
