import { useState, useEffect } from "react";
import "./ExploreBooks.css";
import { FaBookmark, FaHeart } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { formatBookData } from "../helpers/bookFormatter";

const API_BASE_URL = "https://project-final-044d.onrender.com";

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


	// Fetch books from the API
	const fetchBooks = async (endpoint, category = null) => {
		setLoading(true);
		setError("");
		setSelectedCategory(category);

		try {
			const url = `${API_BASE_URL}${endpoint}`;
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Server error: ${response.status} ${response.statusText}`);
			}
			const data = await response.json();
			if (!data.data || !Array.isArray(data.data.books)) {
				throw new Error("Unexpected response structure from server.");
			}

			// Use formatBookData
			const fetchedBooks = data.data.books.flat().map((book) =>
				formatBookData(book)
			);

			setBooks(fetchedBooks);
		} catch (err) {
			setError(err.message || "Failed to load books. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Fetch the user's saved/liked books
	const fetchUserBooks = async () => {
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

			const favoritesData = await favoritesRes.json();
			const toReadData = await toReadRes.json();

			// Convert the arrays 
			setLikedBooks(
				favoritesData.reduce((acc, book) => ({ ...acc, [book.id]: true }), {})
			);
			setSavedBooks(
				toReadData.reduce((acc, book) => ({ ...acc, [book.id]: true }), {})
			);
		} catch (error) {
			console.error("Error fetching user books:", error);
		}
	};


	// handleLike (POST or DELETE)
	const handleLike = async (book) => {
		const token = localStorage.getItem("token");
		if (!token) return alert("Please log in to like books.");

		const isLiked = likedBooks[book.id];

		// Decide endpoint & method based on isLiked
		const endpoint = `${API_BASE_URL}/users/me/favorites${isLiked ? `/${encodeURIComponent(book.id)}` : ""
			}`;
		const method = isLiked ? "DELETE" : "POST";

		try {
			const response = await fetch(endpoint, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: isLiked ? null : JSON.stringify(book),
			});
			if (!response.ok) {
				throw new Error(
					`Failed to update favorites. Server responded with: ${response.status}`
				);
			}
			// Update local state so we only send one request
			setLikedBooks((prev) => ({ ...prev, [book.id]: !isLiked }));
		} catch (error) {
			console.error("Error updating favorites:", error);
		}
	};


	// handleSave (POST or DELETE) 
	const handleSave = async (book) => {
		const token = localStorage.getItem("token");
		if (!token) return alert("Please log in to save books.");

		const isSaved = savedBooks[book.id];

		// Decide endpoint & method based on isSaved
		const endpoint = `${API_BASE_URL}/users/me/to-read${isSaved ? `/${encodeURIComponent(book.id)}` : ""
			}`;
		const method = isSaved ? "DELETE" : "POST";

		// Format the book before saving
		const formattedBook = formatBookData(book);

		try {
			const response = await fetch(endpoint, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: isSaved ? null : JSON.stringify(formattedBook),
			});
			if (response.status === 403) {
				console.warn("Session expired. Logging out...");
				localStorage.removeItem("token");
				window.location.href = "/login";
				return;
			}
			if (!response.ok) {
				throw new Error(
					`Failed to update saved books. Server responded with: ${response.status}`
				);
			}
			// Update local state
			setSavedBooks((prev) => ({ ...prev, [book.id]: !isSaved }));
		} catch (error) {
			console.error("Error updating saved books:", error);
		}
	};


	// Handl search
	const handleSearch = async (queryString) => {
		if (!queryString.trim()) {
			return fetchBooks("/rating");
		}
		const searchQuery = new URLSearchParams();
		searchQuery.append("query", queryString.trim());
		await fetchBooks(`/search?${searchQuery.toString()}`);
	};

	// Render
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
								<p className="book-title">
									<strong>{book.title}</strong>
								</p>
								<div className="book-actions">
									<button
										className={`like-button ${likedBooks[book.id] ? "liked" : ""}`}
										onClick={() => handleLike(book)}
									>
										<FaHeart color={likedBooks[book.id] ? "black" : "gray"} />
									</button>
									<button
										className={`save-button ${savedBooks[book.id] ? "saved" : ""}`}
										onClick={() => handleSave(book)}
									>
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
