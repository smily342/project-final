import mongoose from "mongoose";

// schema for users
const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  
  email: { type: String, required: true, unique: true },
  
  password: { type: String, required: true },
  
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  
  toRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const User = mongoose.model("User", userSchema);

export default User;
