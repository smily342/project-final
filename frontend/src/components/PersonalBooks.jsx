import { useEffect } from "react";
import "./PersonalBooks.css";
import { FaTrash } from "react-icons/fa";
import useStore from "../store/useStore";

const API_BASE_URL = "http://localhost:3000"; // Change if deploying!!
const FALLBACK_IMAGE = "https://via.placeholder.com/120x180.png?text=No+Cover"; // Updated URL

export function PersonalBooks() {
  const {
    selectedCategory,
    setSelectedCategory,
    savedBooks,
    setSavedBooks,
    likedBooks,
    setLikedBooks,
    recommendedBooks,
    setRecommendedBooks,
    loading,
    setLoading,
    error,
    setError,
  } = useStore();

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
      console.log("Fetched books:", data);

      const booksArray = data.data?.books || data.data || data;
      console.log("Processed books array:", booksArray);

      const formattedBooks = booksArray.map((book) => ({
        id: book.id || book._id,
        title: book.title,
        image: book.image || FALLBACK_IMAGE, // Updated to use online fallback
        author: Array.isArray(book.authors) ? book.authors.join(", ") : book.authors || "Unknown Author",
        genre: book.genre || "Unknown Genre",
      }));

      console.log("Final books with images:", formattedBooks);

      if (selectedCategory === "saved") setSavedBooks(formattedBooks);
      if (selectedCategory === "liked") setLikedBooks(formattedBooks);
      if (selectedCategory === "recommended") setRecommendedBooks(formattedBooks);
    } catch (err) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

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
                src={book.image}
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                alt={book.title || "Book Cover"}
              />

              <div className="book-info">
                <p className="book-title">{book.title}</p>
                {selectedCategory !== "recommended" && (
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveBook(book.id)}
                  >
                    <FaTrash />
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