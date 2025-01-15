import mongoose from "mongoose";

// Define the schema for a book
const bookSchema = mongoose.Schema({
  // The title of the book (required field)
  title: { type: String, required: true },
  
  // The author of the book (required field)
  author: { type: String, required: true },
  
  // The category or genre of the book (e.g., Fiction, Non-fiction, etc.) (required field)
  category: { type: String, required: true },
  
  // The average rating of the book, with a numeric value (e.g., 1 to 5) (required field)
  rating: { type: Number, required: true },
  
  // A brief description of the book (required field)
  description: { type: String, required: true },
  
  // The URL of the book's cover image (optional field)
  coverImage: { type: String },
});

// Create the Book model based on the bookSchema
const Book = mongoose.model("Book", bookSchema);

// Export the Book model for use in other parts of the application
export default Book;
