const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const cors = require("cors");

const User = require("./models/User");

const app = express();
const path = require("path");

// Serve static files from the 'public/images' directory
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(cors());
const PORT = process.env.PORT || 3000;

// API details
const API_KEY = process.env.API_KEY || "87077da560924d26b6811db60429e36f";
const BOOKS_API_URL = "https://api.bigbookapi.com/search-books";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const MONGO_URI =
	process.env.MONGO_URI ||
	"mongodb+srv://BHS:I3u4i01zNraLZurV@cluster0.i2djz.mongodb.net/final-project?retryWrites=true&w=majority";

// Base URL
const ASSETS_BASE_URL = "https://project-final-044d.onrender.com";

// Connect to MongoDB
mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => { })
	.catch((err) => {
		console.error("Failed to connect to MongoDB", err.message);
		process.exit(1);
	});

// Middleware to parse JSON
app.use(express.json());

// Middleware to authenticate and decode JWT token
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader)
		return res
			.status(401)
			.json({ message: "Access denied. No token provided." });

	const token = authHeader.split(" ")[1];
	if (!token)
		return res
			.status(401)
			.json({ message: "Access denied. Token missing." });

	try {
		const verified = jwt.verify(token, JWT_SECRET);
		req.user = verified;

		if (!req.user._id) {
			console.error("Token does not contain user ID");
			return res
				.status(403)
				.json({ message: "Invalid token structure." });
		}

		next();
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			console.error("Token expired.");
			return res
				.status(403)
				.json({ message: "Session expired. Please log in again." });
		}
		console.error("Token verification error:", err.message);
		res.status(403).json({ message: "Invalid token" });
	}
};

// Health Check Endpoint
app.get("/", (req, res) => {
	res.send("Server is running.");
});

// fetchBooks function 
async function fetchBooks(params) {
	try {
		const response = await axios.get(BOOKS_API_URL, {
			params: { ...params, "api-key": API_KEY },
		});

		if (!response.data || !Array.isArray(response.data.books)) {
			throw new Error("The external API did not return an array for books.");
		}

		// Flatten books array
		let flatBooks;
		try {
			flatBooks = response.data.books.flat();
		} catch (err) {
			flatBooks = response.data.books;
		}


		// Remove duplicate titles
		const uniqueBooks = Array.from(
			new Map(flatBooks.map(book => [book.title.toLowerCase(), book])).values()
		);

		return { data: { books: uniqueBooks }, quota: response.headers };
	} catch (error) {
		if (error.response) {
			console.error("Error response from external API:", error.response.data);
			console.error("Status code:", error.response.status);
		} else {
			console.error("Error message:", error.message);
		}
		throw new Error("Failed to fetch books from external API.");
	}
}

// Fetching books by genre
async function fetchBooksByGenre(genre) {
	return await fetchBooks({ genres: genre, number: 15 });
}

// Route to fetch books by genre
app.get("/genres/:genre", async (req, res) => {
	const { genre } = req.params;
	try {
		const { data, quota } = await fetchBooksByGenre(genre);
		res.json({ data, quota });
	} catch (error) {
		console.error(`Error fetching ${genre} books:`, error.message);
		res.status(500).json({
			message: `Error fetching ${genre} books`,
			error: error.message,
		});
	}
});

// Route to fetch books with the highest ratings
app.get("/rating", async (req, res) => {
	try {
		const { data } = await fetchBooks({
			query: "all books",
			sort: "rating",
			"sort-direction": "DESC",
			number: 10,
		});

		if (!data || !Array.isArray(data.books)) {
			console.error("No books found in API response for /rating");
			return res.status(500).json({ message: "No books found in API response" });
		}

		res.setHeader("Content-Type", "application/json");
		res.json({ data });
	} catch (error) {
		console.error("Error fetching highest-rated books:", error.message);
		res.status(500).json({
			message: "Error fetching highest-rated books.",
			error: error.message,
		});
	}
});

// Route to fetch grouped results (recommendations)
app.get("/group-results", async (req, res) => {
	try {
		const { query = "all books" } = req.query;
		const { data } = await fetchBooks({
			query,
			"group-results": true,
			sort: "rating",
			"sort-direction": "DESC",
			number: 10,
		});
		res.json({ data });
	} catch (error) {
		console.error("Error fetching grouped results:", error.message);
		res.status(500).json({
			message: "Error fetching grouped results.",
			error: error.message,
		});
	}
});

// Search books by title and/or author
app.get("/search", async (req, res) => {
	const { query } = req.query;

	if (!query) {
		console.error("Search query missing");
		return res.status(400).json({ message: "Please provide a query to search." });
	}

	try {
		const params = { query };
		const { data } = await fetchBooks(params);

		if (!data || !Array.isArray(data.books)) {
			console.error("No books found in API response for /search");
			return res.status(500).json({ message: "No books found in API response" });
		}

		res.json({ data });
	} catch (error) {
		console.error("Error searching books:", error.message);
		res.status(500).json({
			message: "Error searching books.",
			error: error.message,
		});
	}
});

// User Signup Route
app.post(
	"/signup",
	[
		body("firstName").notEmpty().withMessage("First name is required."),
		body("lastName").notEmpty().withMessage("Last name is required."),
		body("email").isEmail().withMessage("A valid email is required."),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters long."),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const firstErrorMsg = errors.array()[0].msg;
			console.error("Signup validation error:", firstErrorMsg);
			return res.status(400).json({ message: firstErrorMsg });
		}

		const { firstName, lastName, email, password } = req.body;

		try {
			const existingEmail = await User.findOne({ email });
			if (existingEmail) {
				console.error("Signup error: Email already exists:", email);
				return res.status(400).json({ message: "Email already exists." });
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const user = new User({
				firstName,
				lastName,
				email,
				password: hashedPassword,
			});

			await user.save();
			res.status(201).json({ message: "User registered successfully!" });
		} catch (err) {
			console.error("Error during signup:", err.message);
			res.status(500).json({ message: "Internal server error.", error: err.message });
		}
	}
);

// User Login Route
app.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			console.error("Login failed: Invalid email", email);
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			console.error("Login failed: Invalid password for", email);
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, {
			expiresIn: "30d",
		});
		res.json({ token });
	} catch (err) {
		console.error("Error during login:", err.message);
		res.status(500).json({ message: "Internal server error.", error: err.message });
	}
});

// Get favorites
app.get("/users/me/favorites", authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			console.error("Favorites fetch error: User not found:", req.user._id);
			return res.status(404).json({ message: "User not found." });
		}
		res.json(user.favorites);
	} catch (error) {
		console.error("Error fetching favorites:", error.message);
		res.status(500).json({ message: "Error fetching user favorites." });
	}
});

// Add a book to favorites
app.post("/users/me/favorites", authenticateToken, async (req, res) => {
	try {
		let { id, title, author, genre, image } = req.body;
		const user = await User.findById(req.user._id);
		if (!user) {
			console.error("Add favorite error: User not found:", req.user._id);
			return res.status(404).json({ message: "User not found." });
		}

		if (user.favorites.some((book) => book.id.toString() === id.toString())) {
			console.error("Add favorite error: Book already in favorites, id:", id);
			return res.status(400).json({ message: "Book is already in favorites." });
		}

		user.favorites.push({ id, title, author, genre, image });
		await user.save();

		res.status(200).json({ message: "Book added to favorites.", favorites: user.favorites });
	} catch (error) {
		console.error("Error adding book to favorites:", error.message);
		res.status(500).json({ message: "Internal server error." });
	}
});

// Remove book from favorites
app.delete("/users/me/favorites/:bookId", authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			console.error("Remove favorite error: User not found:", req.user._id);
			return res.status(404).json({ message: "User not found." });
		}

		user.favorites = user.favorites.filter(
			(book) => book.id.toString() !== req.params.bookId.toString()
		);
		await user.save();

		res.status(200).json({ message: "Book removed from favorites.", favorites: user.favorites });
	} catch (error) {
		console.error("Error removing book from favorites:", error.message);
		res.status(500).json({ message: "Internal server error." });
	}
});

// Get to-read list
app.get("/users/me/to-read", authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			console.error("To-read fetch error: User not found:", req.user._id);
			return res.status(404).json({ message: "User not found." });
		}
		res.json(user.toRead);
	} catch (error) {
		console.error("Error fetching to-read list:", error.message);
		res.status(500).json({ message: "Error fetching user to-read list." });
	}
});

// Add a book to the to-read list
app.post("/users/me/to-read", authenticateToken, async (req, res) => {
	try {
		let { id, title, author, genre, image } = req.body;
		const user = await User.findById(req.user._id);
		if (!user) {
			console.error("Add to-read error: User not found:", req.user._id);
			return res.status(404).json({ message: "User not found." });
		}

		if (user.toRead.some((book) => book.id.toString() === id.toString())) {
			console.error("Add to-read error: Book already in to-read list, id:", id);
			return res.status(400).json({ message: "Book is already in the to-read list." });
		}

		user.toRead.push({ id, title, author, genre, image });
		await user.save();

		res.status(200).json({ message: "Book added to to-read list.", toRead: user.toRead });
	} catch (error) {
		console.error("Error adding book to to-read list:", error.message);
		res.status(500).json({ message: "Internal server error." });
	}
});

// Remove a book from the to-read list
app.delete("/users/me/to-read/:bookId", authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			console.error("Remove to-read error: User not found:", req.user._id);
			return res.status(404).json({ message: "User not found." });
		}

		user.toRead = user.toRead.filter(
			(book) => book.id.toString() !== req.params.bookId.toString()
		);
		await user.save();
		res.status(200).json({ message: "Book removed from to-read list.", toRead: user.toRead });
	} catch (error) {
		console.error("Error removing book from to-read list:", error.message);
		res.status(500).json({ message: "Internal server error." });
	}
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
});
