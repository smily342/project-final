import express from "express";
import Book from "../models/Book.js";
import booksData from "../data/books.json"; 


const router = express.Router();

// GET: Fetch general recommendations
router.get("/recommendations", async (req, res) => {
  try {
    // Fetch the top 4 highest-rated books
    const recommendations = await Book.find().sort({ rating: -1 }).limit(4);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendations" });
  }
});

export default router;
