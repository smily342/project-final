import { useState, useEffect } from "react";
import "./ExploreBooks.css";
import { FaBookmark, FaHeart } from "react-icons/fa";
import SearchBar from "./SearchBar";

const API_BASE_URL = "https://project-final-044d.onrender.com/";

export function ExploreBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [likedBooks, setLikedBooks] = useState({});
  const [savedBooks, setSavedBooks] = useState({});

  useEffect(() => {
    fetchBooks("/rating");
    fetchUserBooks();
  }, []);

  const fetchBooks = async (endpoint, category = null) => {
    setLoading(true);
    setError("");
    setSelectedCategory(category);

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Fetching books from: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.data || !Array.isArray(data.data.books)) {
        throw new Error("Unexpected response structure from server.");
      }

      // Truncate titles to a maximum of 31 characters
      const truncateTitle = (title, maxLength = 31) =>
        title.length > maxLength ? title.slice(0, maxLength) + "..." : title;

      const fetchedBooks = data.data.books.flat().map((book) => ({
        id: book.id || book._id,
        title: truncateTitle(book.title),
        image: book.image || "default-book.jpg",
        author: Array.isArray(book.authors) ? book.authors.join(", ") : book.authors || "Unknown Author",
        genre: book.genre || "Unknown Genre",
      }));

      setBooks(fetchedBooks);
    } catch (err) {
      console.error("Error fetching books:", err.message);
      setError(err.message || "Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const [favoritesRes, toReadRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users/me/favorites`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/users/me/to-read`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (favoritesRes.status === 403 || toReadRes.status === 403) {
        console.warn("Session expired. Logging out...");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const favoritesData = await favoritesRes.json();
      const toReadData = await toReadRes.json();

      setLikedBooks(favoritesData.reduce((acc, book) => ({ ...acc, [book.id]: true }), {}));
      setSavedBooks(toReadData.reduce((acc, book) => ({ ...acc, [book.id]: true }), {}));
    } catch (error) {
      console.error("Error fetching user books:", error);
    }
  };

  const handleLike = async (book) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to like books.");

    const isLiked = likedBooks[book.id];
    const method = isLiked ? "DELETE" : "POST";
    const endpoint = `${API_BASE_URL}/users/me/favorites${isLiked ? `/${encodeURIComponent(book.id)}` : ""}`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: isLiked ? null : JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error(`Failed to update favorites. Server responded with: ${response.status}`);
      }

      setLikedBooks((prev) => {
        const updated = { ...prev, [book.id]: !isLiked };
        return updated;
      });
    } catch (error) {
      console.error(" Error updating favorites:", error);
    }
  };

  const handleSave = async (book) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to save books.");

    const isSaved = savedBooks[book.id];
    const method = isSaved ? "DELETE" : "POST";
    const endpoint = `${API_BASE_URL}/users/me/to-read${isSaved ? `/${encodeURIComponent(book.id)}` : ""}`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: isSaved ? null : JSON.stringify(book),
      });

      if (response.status === 403) {
        console.warn("Session expired. Logging out...");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to update saved books. Server responded with: ${response.status}`);
      }

      setSavedBooks((prev) => {
        const updated = { ...prev, [book.id]: !isSaved };
        return updated;
      });
    } catch (error) {
      console.error("Error updating saved books:", error);
    }
  };

  const handleSearch = async ({ title, author }) => {
    const query = new URLSearchParams();
    if (title) query.append("title", title);
    if (author) query.append("author", author);

    await fetchBooks(`/search?${query.toString()}`);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />

      <section className="categories">
        <h2>Explore Categories</h2>
        <div className="category-buttons">
          {["Fiction", "Romance", "Crime", "Biography"].map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => fetchBooks(`/genres/${category.toLowerCase()}`, category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>


      <section className="book-display">
        <h2>{selectedCategory ? `Explore ${selectedCategory}` : "Top-Rated Books"}</h2>
        {loading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div className="book" key={book.id}>
                <img src={book.image} alt={book.title} />
                <p className="book-title"><strong>{book.title}</strong></p>
                <div className="book-actions">
                  <button className={`like-button ${likedBooks[book.id] ? "liked" : ""}`} onClick={() => handleLike(book)}>
                    <FaHeart color={likedBooks[book.id] ? "black" : "gray"} />
                  </button>
                  <button className={`save-button ${savedBooks[book.id] ? "saved" : ""}`} onClick={() => handleSave(book)}>
                    <FaBookmark color={savedBooks[book.id] ? "black" : "gray"} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default ExploreBooks;
