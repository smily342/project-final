import { useEffect } from "react";
import "./PersonalBooks.css";
import { FaTrash } from "react-icons/fa";
import useStore from "../store/useStore";

const API_BASE_URL = "http://localhost:3000";
const FALLBACK_IMAGE = "default-book.jpg";

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

      // Force the books data into an array
      const booksArray =
        Array.isArray(data.data?.books)
          ? data.data.books
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];

      // Truncate titles to a maximum of 31 characters
      const truncateTitle = (title, maxLength = 31) =>
        title.length > maxLength ? title.slice(0, maxLength) + "..." : title;

      // Map each book and ensure a unique identifier is stored in "id"
      const formattedBooks = booksArray.map((book) => {
        const uniqueId = book.id || book._id;
        return {
          id: uniqueId,
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
        };
      });

      console.log("Final books:", formattedBooks);

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

    let endpoint = "";
    if (selectedCategory === "saved") {
      endpoint = `${API_BASE_URL}/users/me/to-read/${encodeURIComponent(bookId)}`;
    } else if (selectedCategory === "liked") {
      endpoint = `${API_BASE_URL}/users/me/favorites/${encodeURIComponent(bookId)}`;
    } else {

      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        if (selectedCategory === "saved") {
          setSavedBooks((prev) =>
            Array.isArray(prev)
              ? prev.filter((book) => String(book.id || book._id) !== String(bookId))
              : []
          );
        } else if (selectedCategory === "liked") {
          setLikedBooks((prev) =>
            Array.isArray(prev)
              ? prev.filter((book) => String(book.id || book._id) !== String(bookId))
              : []
          );
        }
      } else {
        console.error("Failed to remove book.");
      }
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  // Always return an array from getDisplayedBooks
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
                alt={book.title || "Book Cover"}
              />
              <div className="book-info">
                <p className="book-title">{book.title}</p>
                {selectedCategory !== "recommended" && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveBook(book.id || book._id)}
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
