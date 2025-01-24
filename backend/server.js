import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables
import axios from "axios";

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  publishedDate: { type: Date, default: null },
  rating: { type: Number, required: true, min: 0, max: 5 },
  coverImage: { type: String, default: null },
  genre: {
    type: String,
    enum: ["Fiction", "Biography", "Romance", "Crime"],
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);

// Middleware to check API key
app.use((req, res, next) => {
  const apiKey = req.header("api-key");
  console.log("Received API Key:", apiKey);
  if (!apiKey) {
    return res.status(400).json({ message: "Missing API Key" });
  }
  if (apiKey !== process.env.BIGBOOK_API_KEY) {
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Route to fetch all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Route to fetch book by title
app.get("/books/:title", async (req, res) => {
  const { title } = req.params;
  try {
    const book = await Book.findOne({ title });
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book" });
  }
});

// Route to find similar books by genre
app.get("/find-similar-books/:genre", async (req, res) => {
  const { genre } = req.params;
  try {
    const similarBooks = await Book.find({ genre });
    res.json(similarBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching similar books" });
  }
});

// Route to fetch book details from external API
app.get("/external-book/:id", async (req, res) => {
  const { id } = req.params;
  const apiKey = process.env.BIGBOOK_API_KEY;
  const url = `https://api.bigbookapi.com/${id}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "api-key": apiKey,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching book from external API:", error.message);
    res.status(500).json({
      message: "Error fetching book from external API",
      details: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
