import { useState, useEffect } from "react";
import "./PersonalBooks.css";

export function PersonalBooks() {
  const [selectedCategory, setSelectedCategory] = useState("saved");
  const [savedBooks, setSavedBooks] = useState([]);
  const [likedBooks, setLikedBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategoryData() {
      setLoading(true);
      setError(null);

      try {
        let response;
        let data;
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User not authenticated.");
          return;
        }

        if (selectedCategory === "saved") {
          console.log("Fetching saved books...");
          response = await fetch("http://localhost:3000/users/me/to-read", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (selectedCategory === "liked") {
          console.log("Fetching liked books...");
          response = await fetch("http://localhost:3000/users/me/favorites", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (selectedCategory === "recommended") {
          console.log("Fetching recommendations...");
          response = await fetch("http://localhost:3000/group-results");
        }

        // Log the response URL and status for debugging
        console.log(`Response URL: ${response.url}, Status: ${response.status}`);

        if (!response.ok) {
          // Log the raw response body for debugging
          const rawResponse = await response.text();
          console.error("Response Error Body:", rawResponse);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON data
        data = await response.json();

        // Update state based on the selected category
        if (selectedCategory === "saved") setSavedBooks(data || []);
        if (selectedCategory === "liked") setLikedBooks(data || []);
        if (selectedCategory === "recommended") {
          const recommendations = data.data || [];
          setRecommendedBooks(recommendations);
        }
      } catch (err) {
        console.error("Fetch error:", err.message || "Unknown error");
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryData();
  }, [selectedCategory]);

  const getDisplayedBooks = () => {
    if (selectedCategory === "saved") return savedBooks;
    if (selectedCategory === "liked") return likedBooks;
    return recommendedBooks;
  };

  const displayedBooks = getDisplayedBooks();

  return (
    <div className="personal-books">
      <div className="category-buttons-row">
        <button
          className={selectedCategory === "saved" ? "active" : ""}
          onClick={() => setSelectedCategory("saved")}
        >
          Saved Books
        </button>
        <button
          className={selectedCategory === "liked" ? "active" : ""}
          onClick={() => setSelectedCategory("liked")}
        >
          Liked Books
        </button>
        <button
          className={selectedCategory === "recommended" ? "active" : ""}
          onClick={() => setSelectedCategory("recommended")}
        >
          Recommendations
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <div className="books-row">
        {!loading &&
          !error &&
          displayedBooks.map((book) => (
            <div className="book-card" key={book._id || book.id}>
              <img
                className="book-cover"
                src={book.coverImage || "https://via.placeholder.com/120x180?text=No+Cover"}
                alt={book.title || "Book Cover"}
              />
              <div className="book-info">
                <p className="book-title">{book.title}</p>
                <p className="book-author">By {book.author || "Unknown"}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
