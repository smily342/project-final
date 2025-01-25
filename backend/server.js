import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); // Load environment variables

const port = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware to check API key
const HARD_CODED_API_KEY = process.env.BIGBOOK_API_KEY;

app.use((req, res, next) => {
  const apiKey = req.header("api-key");
  
  // Skip validation for localhost
  if (req.hostname === "localhost" || req.hostname === "127.0.0.1") {
    console.log("Skipping API key validation for localhost");
    return next();
  }

  if (!apiKey) {
    return res.status(400).json({ message: "Missing API Key" });
  }
  if (apiKey !== HARD_CODED_API_KEY) {
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("Hello Technigo! Server is running.");
});

// Route to fetch books by query
app.get("/books", async (req, res) => {
  const { query } = req.query;
  const url = `https://api.bigbookapi.com/search-books?query=${query}&api-key=${HARD_CODED_API_KEY}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books from external API:", error.message);
    res.status(500).json({
      message: "Error fetching books from external API",
      details: error.message,
    });
  }
});

// Route to fetch max-rating books from external API
app.get("/rating", async (req, res) => {
  const { maxRating } = req.query;

  // Validate that maxRating is provided and is a number between 0 and 1
  if (!maxRating || isNaN(maxRating) || maxRating < 0 || maxRating > 1) {
    return res.status(400).json({
      message: "Invalid or missing 'maxRating'. It must be a number between 0 and 1.",
    });
  }

  const url = `https://api.bigbookapi.com/max-rating?maxRating=${maxRating}&api-key=${HARD_CODED_API_KEY}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching max-rating from external API:", error.message);
    res.status(500).json({
      message: "Error fetching max-rating from external API",
      details: error.message,
    });
  }
});


// Route to fetch recommendations based on liked books
app.get("/recommendations", async (req, res) => {
  const { likedBooks } = req.query;
  const url = `https://api.bigbookapi.com/recommendations?likedBooks=${likedBooks}&api-key=${HARD_CODED_API_KEY}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching recommendations from external API:", error.message);
    res.status(500).json({
      message: "Error fetching recommendations from external API",
      details: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
