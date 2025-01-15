import express from "express";
import Book from "../models/Book.js";

const router = express.Router();

// GET: Fetch all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from the database
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// POST: Add a new book
router.post("/", async (req, res) => {
  try {
    const book = await Book.create(req.body); // Create a new book in the database
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: "Error creating book" });
  }
});

export default router;
