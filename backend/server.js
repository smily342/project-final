const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Your API details
const API_KEY = "87077da560924d26b6811db60429e36f";
const BOOKS_API_URL = "https://api.bigbookapi.com/search-books";

// Middleware to parse JSON
app.use(express.json());

// Health Check Endpoint
app.get("/", (req, res) => {
    res.send(
        "Server is running. Use /books, /api/genres/:category, /rating, or /group-results to fetch data."
    );
});

// Helper function to fetch books by custom parameters
async function fetchBooks(params) {
    try {
        // Make the request to the BigBook API with the given parameters
        const response = await axios.get(BOOKS_API_URL, {
            params: {
                ...params,
                "api-key": API_KEY, // Add the API key
            },
        });

        return { data: response.data, quota: response.headers };
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

// Dynamic category-specific endpoint
app.get("/api/genres/:category", async (req, res) => {
    const { category } = req.params; // Extract the category from the URL
    try {
        const { data, quota } = await fetchBooks({ genres: category.toLowerCase() });
        res.json({ data, quota });
    } catch (error) {
        console.error(`Error fetching ${category} books:`, error);
        res.status(500).json({ message: `Error fetching ${category} books`, error });
    }
});

// Route to fetch books with the highest ratings
app.get("/rating", async (req, res) => {
    try {
        const defaultQuery = "all books";
        const { data, quota } = await fetchBooks({
            query: defaultQuery,
            sort: "rating",
            "sort-direction": "DESC",
            number: 10,
        });

        res.json({ data, quota });
    } catch (error) {
        console.error("Error fetching highest-rated books:", error);
        res.status(500).json({ message: "Error fetching highest-rated books", error });
    }
});

// Route to fetch grouped results (recommendations)
app.get("/group-results", async (req, res) => {
    try {
        const { query = "all books" } = req.query;
        const { data, quota } = await fetchBooks({
            query,
            "group-results": true,
            sort: "rating",
            "sort-direction": "DESC",
            number: 10,
        });

        res.json({ data, quota });
    } catch (error) {
        console.error("Error fetching grouped results:", error);
        res.status(500).json({ message: "Error fetching grouped results", error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

