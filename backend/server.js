const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const User = require("./models/user.js");


const app = express();
const PORT = process.env.PORT || 3000;

// API details
const API_KEY = process.env.API_KEY || "87077da560924d26b6811db60429e36f";
const BOOKS_API_URL = "https://api.bigbookapi.com/search-books";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://BHS:I3u4i01zNraLZurV@cluster0.i2djz.mongodb.net/final-project?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err.message);
    process.exit(1);
  });

// Middleware to parse JSON
app.use(express.json());

// Health Check Endpoint
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// Helper function to fetch books by custom parameters
async function fetchBooks(params) {
  try {
    const response = await axios.get(BOOKS_API_URL, {
      params: {
        ...params,
        "api-key": API_KEY, // Add the API key
      },
    });

    return { data: response.data, quota: response.headers };
  } catch (error) {
    console.error("Error fetching books from external API:", error.message);
    throw new Error("Failed to fetch books from external API.");
  }
}

// Helper function to fetch books by genre
async function fetchBooksByGenre(genre) {
  return await fetchBooks({ genres: genre });
}

// Genre-specific endpoints
app.get("/genres/fiction", async (req, res) => {
  try {
    const { data, quota } = await fetchBooksByGenre("fiction");
    res.json({ data, quota });
  } catch (error) {
    console.error("Error fetching fiction books:", error.message);
    res.status(500).json({ message: "Error fetching fiction books", error: error.message });
  }
});

app.get("/genres/crime", async (req, res) => {
  try {
    const { data, quota } = await fetchBooksByGenre("crime");
    res.json({ data, quota });
  } catch (error) {
    console.error("Error fetching crime books:", error.message);
    res.status(500).json({ message: "Error fetching crime books", error: error.message });
  }
});

app.get("/genres/romance", async (req, res) => {
  try {
    const { data, quota } = await fetchBooksByGenre("romance");
    res.json({ data, quota });
  } catch (error) {
    console.error("Error fetching romance books:", error.message);
    res.status(500).json({ message: "Error fetching romance books", error: error.message });
  }
});

app.get("/genres/biography", async (req, res) => {
  try {
    const { data, quota } = await fetchBooksByGenre("biography");
    res.json({ data, quota });
  } catch (error) {
    console.error("Error fetching biography books:", error.message);
    res.status(500).json({ message: "Error fetching biography books", error: error.message });
  }
});

// Route to fetch books with the highest ratings
app.get("/rating", async (req, res) => {
  try {
    const { data } = await fetchBooks({
      query: "all books",
      sort: "rating",
      "sort-direction": "DESC",
      number: 10,
    });
    res.json({ data });
  } catch (error) {
    console.error("Error fetching highest-rated books:", error.message);
    res.status(500).json({ message: "Error fetching highest-rated books.", error: error.message });
  }
});

// Route to fetch grouped results (recommendations)
app.get("/group-results", async (req, res) => {
  try {
    const { query = "all books" } = req.query;
    const { data } = await fetchBooks({
      query,
      "group-results": true,
      sort: "rating",
      "sort-direction": "DESC",
      number: 10,
    });
    res.json({ data });
  } catch (error) {
    console.error("Error fetching grouped results:", error.message);
    res.status(500).json({ message: "Error fetching grouped results.", error: error.message });
  }
});

// User Signup Route
app.post(
  "/signup",
  [
    body("firstName").notEmpty().withMessage("First name is required."),
    body("lastName").notEmpty().withMessage("Last name is required."),
    body("email").isEmail().withMessage("A valid email is required."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: "Email already exists." });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ firstName, lastName, email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
      console.error("Error during signup:", err.message);
      res.status(500).json({ message: "Internal server error.", error: err.message });
    }
  }
);

// User Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password." });

    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
});

// ADD THESE ROUTES - NOTHING ELSE CHANGED
app.get("/users/:userId/favorites", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user.favorites);
  } catch (error) {
    console.error("Error fetching user favorites:", error.message);
    res.status(500).json({ message: "Error fetching user favorites.", error: error.message });
  }
});

app.get("/users/:userId/to-read", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("toRead");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user.toRead);
  } catch (error) {
    console.error("Error fetching user to-read:", error.message);
    res.status(500).json({ message: "Error fetching user to-read.", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
