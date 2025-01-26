import React, { useState } from "react";
import "./ExploreBooks.css";

export function ExploreBooks() {
  // State to hold the fetched books
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch books by category from your backend
  const fetchBooksByCategory = async (category) => {
    setLoading(true); // Start loading state
    setError(""); // Reset error state

    try {
      // Fetch books from your backend using the Fetch API
      const response = await fetch(`/api/genres/${category.toLowerCase()}`); // Updated to include "/api"

      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json(); // Parse the JSON response
      console.log("API Response:", data);

      // Map the backend response to match the expected structure
      const fetchedBooks = data.data.map((book) => ({
        title: book.title,
        image: book.cover_image || "default-book.jpg", // Fallback for missing image
      }));

      console.log("Mapped Books:", fetchedBooks);
      setBooks(fetchedBooks); // Update books state
    } catch (err) {
      console.error("Error fetching books:", err.message);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <>
      {/* Categories */}
      <section className="categories">
        <h2>Explore Categories</h2>
        <div className="category-buttons">
          <button onClick={() => fetchBooksByCategory("Fiction")}>Fiction</button>
          <button onClick={() => fetchBooksByCategory("Romance")}>Romance</button>
          <button onClick={() => fetchBooksByCategory("Crime")}>Crime</button>
          <button onClick={() => fetchBooksByCategory("Biography")}>Biography</button>
        </div>
      </section>

      {/* Book Section */}
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
                  <img
                    src={book.image} // Display book image
                    alt={book.title}
                  />
                  <p>{book.title}</p>
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
