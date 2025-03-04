import { useEffect, useState } from "react";
import "./PersonalBooks.css";
import { FaTrash } from "react-icons/fa";
import useStore from "../store/useStore";
import { formatBookData } from "../helpers/bookFormatter";

const API_BASE_URL = "https://project-final-044d.onrender.com";

export function PersonalBooks() {
	console.log("🔄 PersonalBooks component re-rendered!");
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
	}, [selectedCategory]);

	const fetchCategoryData = async () => {
		console.log(`📚 Fetching books for category: ${selectedCategory}`);
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				setError("User not authenticated.");
				return;
			}
			let endpoint = "";
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
			console.log("🔍 Raw fetched data:", data);
			// Format the data with the shared helper.
			const booksArray = (Array.isArray(data) ? data : data.data?.books || []).map((book, index) =>
				formatBookData(book, index)
			);
			booksArray.forEach((book, index) => {
				console.log(`✅ Processed Book ${index}:`, book.title, book.image);
			});
			if (selectedCategory === "saved") {
				setSavedBooks(booksArray);
			} else if (selectedCategory === "liked") {
				setLikedBooks(booksArray);
			} else if (selectedCategory === "recommended") {
				setRecommendedBooks(booksArray);
			}
		} catch (err) {
			console.error("❌ Error fetching data:", err.message);
			setError(err.message || "Error fetching data");
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveBook = async (bookId) => {
		console.log(`🗑 Attempting to remove book with ID: ${bookId}`);
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
			console.warn("⚠ Invalid category for book removal.");
			setRemovingBookId(null);
			return;
		}
		try {
			const response = await fetch(endpoint, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (response.ok) {
				console.log("✅ Book successfully removed from backend.");
				if (selectedCategory === "saved") {
					const updated = savedBooks.filter((book) => book.id !== bookId);
					setSavedBooks(updated);
				} else if (selectedCategory === "liked") {
					const updated = likedBooks.filter((book) => book.id !== bookId);
					setLikedBooks(updated);
				}
			} else {
				console.error(`❌ Failed to remove book with ID: ${bookId}. Status: ${response.status}`);
				alert("Failed to remove the book. Please try again.");
			}
		} catch (err) {
			console.error("❌ Error removing book:", err);
			alert("An error occurred while removing the book. Please try again.");
		} finally {
			setRemovingBookId(null);
		}
	};

	// Determine which books to display
	const displayedBooks =
		selectedCategory === "saved"
			? savedBooks
			: selectedCategory === "liked"
				? likedBooks
				: recommendedBooks;

	// Filter duplicates so that each key is unique
	const uniqueDisplayedBooks = displayedBooks.filter(
		(book, index, self) => index === self.findIndex((b) => b.id === book.id)
	);

	console.log("🖼 Displayed Books in PersonalBooks (unique):");
	uniqueDisplayedBooks.forEach((book, index) => {
		console.log(`Book ${index}:`, book.title, book.image);
	});

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
				{uniqueDisplayedBooks.map((book, index) => {
					console.log(`🎨 Rendering Book ${index}:`, book.title, book.image);
					return (
						<div className="book-card" key={book.id}>
							<img className="book-cover" src={book.image} alt={book.title || "Book Cover"} />
							<div className="book-info">
								<p className="book-title">{book.title}</p>
								<button
									type="button"
									className="remove-button"
									onClick={() => handleRemoveBook(book.id)}
									disabled={removingBookId === book.id}
								>
									{removingBookId === book.id ? "" : <FaTrash />}
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default PersonalBooks;
