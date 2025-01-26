const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

import User from "./models/user.js"; // Ensure the correct path and extension


const app = express();
const PORT = process.env.PORT || 3000;

// Your API details
const API_KEY = process.env.BIGBOOK_API_KEY || "your_api_key";
const BOOKS_API_URL = "https://api.bigbookapi.com/search-books";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://BHS:I3u4i01zNraLZurV@cluster0.i2djz.mongodb.net/final-project?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Middleware to parse JSON
app.use(express.json());

// Health Check Endpoint
app.get("/", (req, res) => {
  res.send(
    "Server is running. Use /books, /genres/fiction, /genres/crime, /genres/romance, /genres/biography, /rating, or /group-results to fetch data."
  );
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
    throw error.response?.data || error.message;
  }
}

// User Signup Route
app.post(
  "/signup",
  [
    body("firstName").notEmpty().withMessage("First name is required."),
    body("lastName").notEmpty().withMessage("Last name is required."),
    body("email").isEmail().withMessage("A valid email is required."),
    body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, username, password } = req.body;

    try {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: "Email already exists." });

      const existingUsername = await User.findOne({ username });
      if (existingUsername) return res.status(400).json({ message: "Username already exists." });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ firstName, lastName, email, username, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error.", error: err.message });
    }
  }
);

// User Login Route
app.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
    if (!user) return res.status(400).json({ message: "Invalid username/email or password." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid username/email or password." });

    const token = jwt.sign({ _id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
});

// Keep your existing endpoints unchanged

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
