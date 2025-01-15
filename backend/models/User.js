import mongoose from "mongoose";

// Define the schema for a user
const userSchema = mongoose.Schema({
  // The username of the user (required and must be unique)
  username: { type: String, required: true, unique: true },
  
  // The email of the user (required and must be unique)
  email: { type: String, required: true, unique: true },
  
  // The password of the user (required field)
  password: { type: String, required: true },
  
  // A list of favorite books, referencing the Book model
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  
  // A list of books the user wants to read, referencing the Book model
  toRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

// Create the User model based on the userSchema
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
export default User;
