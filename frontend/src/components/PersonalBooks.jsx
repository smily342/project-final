import { useEffect, useState } from "react";
import "./PersonalBooks.css";
import { FaTrash } from "react-icons/fa";
import useStore from "../store/useStore";

const API_BASE_URL = "https://project-final-044d.onrender.com/";
const FALLBACK_IMAGE = "default-book.jpg";

export function PersonalBooks() {
  console.log("PersonalBooks component re-rendered!");

  const [removingBookId, setRemovingBookId] = useState(null); // Track the book being removed

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
    console.log("fetchCategoryData called! Fetching data...");
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
      const booksArray =
        Array.isArray(data.data?.books)
          ? data.data.books
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];

      const truncateTitle = (title, maxLength = 31) =>
        title.length > maxLength ? title.slice(0, maxLength) + "..." : title;

      const formattedBooks = booksArray.map((book) => ({
        id: book.id || book._id,
        title: truncateTitle(book.title),
        image: book.image
          ? book.image.startsWith("http")
            ? book.image
            : `${API_BASE_URL}/${book.image}`
          : `${API_BASE_URL}/${FALLBACK_IMAGE}`,
        author: Array.isArray(book.authors)
          ? book.authors.join(", ")
          : book.authors || "Unknown Author",
        genre: book.genre || "Unknown Genre",
      }));

      if (selectedCategory === "saved") setSavedBooks(formattedBooks);
      if (selectedCategory === "liked") setLikedBooks(formattedBooks);
      if (selectedCategory === "recommended") setRecommendedBooks(formattedBooks);
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBook = async (bookId) => {
    console.log(`Attempting to remove book with ID: ${bookId}`);
    setRemovingBookId(bookId); // Mark the book as being removed

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to modify your books.");
      setRemovingBookId(null);
      return;
    }

    let endpoint = "";
    if (selectedCategory === "saved") {
      endpoint = `${API_BASE_URL}/users/me/to-read/${encodeURIComponent(bookId)}`;
    } else if (selectedCategory === "liked") {
      endpoint = `${API_BASE_URL}/users/me/favorites/${encodeURIComponent(bookId)}`;
    } else {
      console.warn("Invalid category for book removal.");
      setRemovingBookId(null);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        console.log("Book successfully removed from backend.");
        if (selectedCategory === "saved") {
          setSavedBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        } else if (selectedCategory === "liked") {
          setLikedBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        }
      } else {
        console.error(`Failed to remove book with ID: ${bookId}. Status: ${response.status}`);
        alert("Failed to remove the book. Please try again.");
        fetchCategoryData(); // Revert state
      }
    } catch (err) {
      console.error("Error removing book:", err);
      alert("An error occurred while removing the book. Please try again.");
      fetchCategoryData(); // Revert state
    } finally {
      setRemovingBookId(null); // Clear the removal flag
    }
  };

  const getDisplayedBooks = () => {
    if (selectedCategory === "saved") return Array.isArray(savedBooks) ? savedBooks : [];
    if (selectedCategory === "liked") return Array.isArray(likedBooks) ? likedBooks : [];
    return Array.isArray(recommendedBooks) ? recommendedBooks : [];
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

      {loading && <div className="loading-text">Loading...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <div className="books-row">
        {!loading &&
          !error &&
          displayedBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <img
                className="book-cover"
                src={book.image}
                alt={book.title || "Book Cover"}
              />
              <div className="book-info">
                <p className="book-title">{book.title}</p>
                {selectedCategory !== "recommended" && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveBook(book.id)}
                    disabled={removingBookId === book.id} // Disable the button while removing
                  >
                    {removingBookId === book.id ? "Removing..." : <FaTrash />}
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

