import { useEffect, useState } from "react";
import "./PersonalBooks.css";
import { FaTrash, FaHeart, FaBookmark } from "react-icons/fa";
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
	}, [selectedCategory]);

	// Fetch books for the current category 
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


			if (selectedCategory === "saved") {
				setSavedBooks(
					formattedBooks.reduce((acc, book) => ({ ...acc, [book.id]: book }), {})
				);
			}
			if (selectedCategory === "liked") {
				setLikedBooks(
					formattedBooks.reduce((acc, book) => ({ ...acc, [book.id]: book }), {})
				);
			}
			if (selectedCategory === "recommended") {
				setRecommendedBooks(formattedBooks);
			}
		} catch (err) {
			console.error("Error fetching data:", err.message);
			setError(err.message || "Error fetching data");
		} finally {
			setLoading(false);
		}
	};


	const refreshUserBooks = async () => {
		const token = localStorage.getItem("token");
		if (!token) return;
		try {
			const [favoritesRes, toReadRes] = await Promise.all([
				fetch(`${API_BASE_URL}/users/me/favorites`, {
					headers: { Authorization: `Bearer ${token}` },
				}),
				fetch(`${API_BASE_URL}/users/me/to-read`, {
					headers: { Authorization: `Bearer ${token}` },
				}),
			]);
			if (favoritesRes.ok && toReadRes.ok) {
				const favoritesData = await favoritesRes.json();
				const toReadData = await toReadRes.json();
				const likedObj = favoritesData.reduce((acc, book) => {
					acc[book.id] = book;
					return acc;
				}, {});
				const savedObj = toReadData.reduce((acc, book) => {
					acc[book.id] = book;
					return acc;
				}, {});
				setLikedBooks(likedObj);
				setSavedBooks(savedObj);
			}
		} catch (error) {
			console.error("Error refreshing user books:", error);
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
				// Optimistically update the state by removing the key
				if (selectedCategory === "saved") {
					const updated = { ...savedBooks };
					delete updated[bookId];
					setSavedBooks(updated);
				} else if (selectedCategory === "liked") {
					const updated = { ...likedBooks };
					delete updated[bookId];
					setLikedBooks(updated);
				}
				await refreshUserBooks();
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

	const handleLike = async (book) => {
		const token = localStorage.getItem("token");
		if (!token) return alert("Please log in to like books.");

		const isLiked = !!likedBooks[book.id];
		const endpoint = `${API_BASE_URL}/users/me/favorites${isLiked ? `/${encodeURIComponent(book.id)}` : ""}`;

		try {
			const response = await fetch(endpoint, {
				method: isLiked ? "DELETE" : "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: isLiked ? null : JSON.stringify(book),
			});

			if (!response.ok) {
				throw new Error(`Failed to update favorites. Server responded with: ${response.status}`);
			}

			setLikedBooks((prev) => {
				const newState = { ...prev };
				if (isLiked) {
					delete newState[book.id];
				} else {
					newState[book.id] = book;
				}
				return newState;
			});
			await refreshUserBooks();
		} catch (error) {
			console.error("Error updating favorites:", error);
		}
	};

	const handleSave = async (book) => {
		const token = localStorage.getItem("token");
		if (!token) return alert("Please log in to save books.");

		const isSaved = !!savedBooks[book.id];
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
				method: isSaved ? "DELETE" : "POST",
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

			setSavedBooks((prev) => {
				const newState = { ...prev };
				if (isSaved) {
					delete newState[book.id];
				} else {
					newState[book.id] = book;
				}
				return newState;
			});
			await refreshUserBooks();
		} catch (error) {
			console.error("Error updating saved books:", error);
		}
	};

	// return true if the book exists in the state.
	const isBookLiked = (bookId) => !!likedBooks[bookId];
	const isBookSaved = (bookId) => !!savedBooks[bookId];


	const getDisplayedBooks = () => {
		if (selectedCategory === "saved") return Object.values(savedBooks);
		if (selectedCategory === "liked") return Object.values(likedBooks);
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
