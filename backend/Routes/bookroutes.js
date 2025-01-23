import express from 'express';
import booksData from '../data/books.json'; 

const router = express.Router();

// Route to fetch all books
router.get('/books', (req, res) => {
  res.status(200).json(booksData); 
});

// Route to fetch book by title
router.get('/:title', (req, res) => {
  const bookTitle = req.params.title;
  const book = booksData.find(b => b.title === bookTitle);
  if (book) {
    res.status(200).json(book); 
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

export default router;
