import mongoose from "mongoose";

//  schema for a book
const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  
  author: { type: String, required: true },
  
  category: { type: String, required: true },
  
  rating: { type: Number, required: true },
  
  description: { type: String, required: true },
  
  coverImage: { type: String },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
