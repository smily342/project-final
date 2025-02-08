import { useEffect, useState } from "react";
import "./PersonalBooks.css";
import { FaTrash, FaHeart, FaBookmark } from "react-icons/fa"; // <-- Import the additional icons
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
          const updated = savedBooks.filter((book) => String(book.id) !== String(bookId));
          setSavedBooks(updated);
        } else if (selectedCategory === "liked") {
          const updated = likedBooks.filter((book) => String(book.id) !== String(bookId));
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

  // NEW: Like and Save functions (same as in ExploreBooks, adapted for array-based state)
  const handleLike = async (book) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to like books.");

    const isLiked = likedBooks.some(b => String(b.id) === String(book.id));
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

      // Update local state: remove if already liked, add otherwise
      if (isLiked) {
        const updated = likedBooks.filter(b => String(b.id) !== String(book.id));
        setLikedBooks(updated);
      } else {
        setLikedBooks([...likedBooks, book]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleSave = async (book) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to save books.");

    const isSaved = savedBooks.some(b => String(b.id) === String(book.id));
    const method = isSaved ? "DELETE" : "POST";
    const endpoint = `${API_BASE_URL}/users/me/to-read${isSaved ? `/${encodeURIComponent(book.id)}` : ""}`;

    const bookPayload = {
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      image: book.image,
    };

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: isSaved ? null : JSON.stringify(bookPayload),
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

      // Update local state: remove if already saved, add otherwise
      if (isSaved) {
        const updated = savedBooks.filter(b => String(b.id) !== String(book.id));
        setSavedBooks(updated);
      } else {
        setSavedBooks([...savedBooks, book]);
      }
    } catch (error) {
      console.error("Error updating saved books:", error);
    }
  };

  // Helper functions to check if a book is liked or saved
  const isBookLiked = (bookId) => likedBooks.some(b => String(b.id) === String(bookId));
  const isBookSaved = (bookId) => savedBooks.some(b => String(b.id) === String(bookId));

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
                {selectedCategory === "recommended" ? (
                  // NEW: Render the like and save buttons for recommendation books
                  <div className="book-actions">
                    <button
                      className={`like-button ${isBookLiked(book.id) ? "liked" : ""}`}
                      onClick={() => handleLike(book)}
                    >
                      <FaHeart color={isBookLiked(book.id) ? "black" : "gray"} />
                    </button>
                    <button
                      className={`save-button ${isBookSaved(book.id) ? "saved" : ""}`}
                      onClick={() => handleSave(book)}
                    >
                      <FaBookmark color={isBookSaved(book.id) ? "black" : "gray"} />
                    </button>
                  </div>
                ) : (
                  // Existing remove button for saved/liked categories
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
