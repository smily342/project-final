import { useState } from "react";
import "./ExploreBooks.css";
import { FaSave } from "react-icons/fa";

export function ExploreBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected button

  const fetchBooksByCategory = async (category) => {
    setLoading(true);
    setError("");
    setSelectedCategory(category); // Set the clicked button as active

    try {
      const response = await fetch(`/genres/${category.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      const fetchedBooks = data.data.books.flat().map((book) => ({
        title: book.title,
        image: book.image || "default-book.jpg",
        author: Array.isArray(book.authors) ? book.authors.join(", ") : book.authors || "Unknown Author",
      }));

      console.log("Mapped Books:", fetchedBooks);
      setBooks(fetchedBooks);
    } catch (err) {
      console.error("Error fetching books:", err.message);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="categories">
        <h2>Explore Categories</h2>
        <div className="category-buttons">
          {["Fiction", "Romance", "Crime", "Biography"].map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => fetchBooksByCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="book-display">
        <h2>What Will You Discover?</h2>
        {loading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="books-grid">
            {books.length > 0 ? (
              books.map((book, index) => (
                <div className="book" key={index}>
                  <img src={book.image} alt={book.title} />
                  <p className="book-title"><strong>{book.title}</strong></p>
                  <p className="book-author">{book.author}</p> {/* Fixed author display */}
                </div>
              ))
            ) : (
              <p>No books available. Select a category to explore.</p>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default ExploreBooks;
