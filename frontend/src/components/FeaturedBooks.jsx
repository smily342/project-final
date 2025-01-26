import React, { useState, useEffect } from "react";
import "./FeaturedBooks.css";

export function FeaturedBooks() {
  // State to hold the featured books
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch featured books on component mount
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      setLoading(true); // Start loading state
      setError(""); // Reset error state

      try {
        // Fetch books from the /rating endpoint
        const response = await fetch("/rating");

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched featured books:", data); // Debugging log

        // Map the backend response to match the expected structure
        const fetchedBooks = data.data.map((book) => ({
          id: book.id, // Add a unique ID if not already present
          title: book.title,
          coverImage: book.cover_image || "default-book.jpg", // Fallback for missing image
          author: book.author_name || "Unknown Author", // Replace with API field for author
          description: book.description || "", // Replace with API field for description
        }));

        setBooks(fetchedBooks); // Update state with the fetched books
      } catch (err) {
        console.error("Error fetching featured books:", err.message);
        setError("Failed to load featured books. Please try again.");
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchFeaturedBooks();
  }, []); // Run only once when the component mounts

  if (loading) {
    return <div>Loading featured books...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!books || books.length === 0) {
    return <div>No featured books available.</div>;
  }

  return (
    <section className="featured-books-section">
      <div className="featured-books-container">
        {books.map((book) => (
          <div className="featured-book-card" key={book.id}>
            {book.coverImage && (
              <img
                className="featured-book-cover"
                src={book.coverImage}
                alt={`${book.title} cover`}
              />
            )}

            <div className="featured-book-info">
              <h3 className="featured-book-title">{book.title}</h3>
              {book.author && (
                <p className="featured-book-author">by {book.author}</p>
              )}
              {book.description && (
                <p className="featured-book-description">{book.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedBooks;
