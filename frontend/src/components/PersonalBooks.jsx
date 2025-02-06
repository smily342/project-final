import { useEffect, useState } from "react";
import "./PersonalBooks.css";
import { FaTrash } from "react-icons/fa";
import useStore from "../store/useStore";

const API_BASE_URL = "https://project-final-044d.onrender.com";

export function PersonalBooks() {
  console.log("PersonalBooks component re-rendered!");

  const [removingBookId, setRemovingBookId] = useState(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const formattedBooks = booksArray.map((book) => {
        const id = book.id || book._id;
        if (!id) {
          console.warn("Book without id encountered:", book);
        }
        return {
          id,
          title: truncateTitle(book.title),
          image: book.image,
          author: Array.isArray(book.authors)
            ? book.authors.join(", ")
            : book.authors || "Unknown Author",
          genre: book.genre || "Unknown Genre",
        };
      });

      console.log("Formatted Books:", formattedBooks);

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
    setRemovingBookId(bookId);

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
          console.log("Saved books before deletion:", savedBooks);
          const updated = savedBooks.filter((book) => String(book.id) !== String(bookId));
          console.log("Saved books after deletion:", updated);
          setSavedBooks(updated);
        } else if (selectedCategory === "liked") {
          console.log("Liked books before deletion:", likedBooks);
          const updated = likedBooks.filter((book) => String(book.id) !== String(bookId));
          console.log("Liked books after deletion:", updated);
          setLikedBooks(updated);
        }
      } else {
        console.error(`Failed to remove book with ID: ${bookId}. Status: ${response.status}`);
        alert("Failed to remove the book. Please try again.");
      }
    } catch (err) {
      console.error("Error removing book:", err);
      alert("An error occurred while removing the book. Please try again.");
    } finally {
      setRemovingBookId(null);
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
                    disabled={removingBookId === book.id}
                  >
                    {removingBookId === book.id ? "" : <FaTrash />}
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
