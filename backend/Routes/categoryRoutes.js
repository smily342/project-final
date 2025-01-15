import express from "express";

const router = express.Router();

// Example categories (replace with database-driven logic if needed)
const categories = ["Fiction", "Romance", "Crime", "Biography"];

// GET: Fetch all categories
router.get("/", (req, res) => {
  res.json(categories); // Send the list of categories
});

// GET: Fetch books by category (placeholder route)
router.get("/:name/books", async (req, res) => {
  const { name } = req.params;
  try {
    // Replace this with real logic to fetch books by category
    res.json({ message: `Books in category: ${name}` });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by category" });
  }
});

export default router;
