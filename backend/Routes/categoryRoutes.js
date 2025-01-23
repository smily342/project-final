import express from "express";
import booksData from "../data/books.json"; 


const router = express.Router();

// Example categories
const categories = ["Fiction", "Romance", "Crime", "Biography"];

//Fetch categories
router.get("/", (req, res) => {
  res.json(categories); 
});

// GET: Fetch books by category
router.get("/:name/books", async (req, res) => {
  const { name } = req.params;
  try {
    res.json({ message: `Books in category: ${name}` });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by category" });
  }
});

export default router;
