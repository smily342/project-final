import { useState, useEffect } from "react";
import "./PersonalBooks.css";
import { FaTrash } from "react-icons/fa";

const API_BASE_URL = "http://localhost:3000"; // Change if deploying!!

export function PersonalBooks() {
  const [selectedCategory, setSelectedCategory] = useState("saved");
  const [savedBooks, setSavedBooks] = useState([]);
  const [likedBooks, setLikedBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryData();
  }, [selectedCategory]);

  const fetchCategoryData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      let endpoint;
      if (selectedCategory === "saved") {
        endpoint = "/users/me/to-read";
      } else if (selectedCategory === "liked") {
        endpoint = "/users/me/favorites";
      } else if (selectedCategory === "recommended") {
        endpoint = "/group-results";
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (selectedCategory === "saved") setSavedBooks(data || []);
      if (selectedCategory === "liked") setLikedBooks(data || []);
      if (selectedCategory === "recommended") {
        setRecommendedBooks(data.data || []);
      }
    } catch (err) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove book from "Saved" or "Liked"
  const handleRemoveBook = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to modify your books.");

    const isSaved = selectedCategory === "saved";
    const endpoint = `${API_BASE_URL}/users/me/${isSaved ? "to-read" : "favorites"}/${encodeURIComponent(bookId)}`;

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        if (isSaved) {
          setSavedBooks((prev) => prev.filter((book) => book.id !== bookId));
        } else {
          setLikedBooks((prev) => prev.filter((book) => book.id !== bookId));
        }
      } else {
        console.error("Failed to remove book.");
      }
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

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
            <div className="book-card" key={book.id}>
              <img
                className="book-cover"
                src={book.coverImage || "https://via.placeholder.com/120x180?text=No+Cover"}
                alt={book.title || "Book Cover"}
              />
              <div className="book-info">
                <p className="book-title">{book.title}</p>
                <p className="book-author">By {book.author || "Unknown"}</p>
                {selectedCategory !== "recommended" && (
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveBook(book.id)}
                  >
                    <FaTrash /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PersonalBooks;
