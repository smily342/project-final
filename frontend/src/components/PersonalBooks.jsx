import { useState, useEffect } from "react";
import "./PersonalBooks.css";

export function PersonalBooks({ userId }) {
  const [selectedCategory, setSelectedCategory] = useState("saved");
  const [savedBooks, setSavedBooks] = useState([]);
  const [likedBooks, setLikedBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId && selectedCategory !== "recommended") {
      // If there's no userId for "saved" or "liked," show error or skip
      setError("No user ID provided.");
      return;
    }

    async function fetchCategoryData() {
      setLoading(true);
      setError(null);

      try {
        let response;
        let data;

        if (selectedCategory === "saved") {
          response = await fetch(`/users/${userId}/to-read`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          data = await response.json();
          setSavedBooks(data || []);
        } else if (selectedCategory === "liked") {
          response = await fetch(`/users/${userId}/favorites`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          data = await response.json();
          setLikedBooks(data || []);
        } else if (selectedCategory === "recommended") {
          response = await fetch("/group-results");
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const jsonResponse = await response.json();
          // if the API returns { data: [...] }
          data = jsonResponse.data;
          setRecommendedBooks(data || []);
        }
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryData();
  }, [selectedCategory, userId]);

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
        {!loading && !error && displayedBooks.map((book) => (
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
