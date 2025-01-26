
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
        "Server is running. Use /books, /genres/fiction, /genres/crime, /genres/romance, /genres/biography, /rating, or /group-results to fetch data."
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

// Helper function to fetch books by genre
async function fetchBooksByGenre(genre) {
    return await fetchBooks({ genres: genre });
}

// Genre-specific endpoints
app.get("/genres/fiction", async (req, res) => {
    try {
        const { data, quota } = await fetchBooksByGenre("fiction");
        res.json({ data, quota });
    } catch (error) {
        console.error("Error fetching fiction books:", error);
        res.status(500).json({ message: "Error fetching fiction books", error });
    }
});

app.get("/genres/crime", async (req, res) => {
    try {
        const { data, quota } = await fetchBooksByGenre("crime");
        res.json({ data, quota });
    } catch (error) {
        console.error("Error fetching crime books:", error);
        res.status(500).json({ message: "Error fetching crime books", error });
    }
});

app.get("/genres/romance", async (req, res) => {
    try {
        const { data, quota } = await fetchBooksByGenre("romance");
        res.json({ data, quota });
    } catch (error) {
        console.error("Error fetching romance books:", error);
        res.status(500).json({ message: "Error fetching romance books", error });
    }
});

app.get("/genres/biography", async (req, res) => {
    try {
        const { data, quota } = await fetchBooksByGenre("biography");
        res.json({ data, quota });
    } catch (error) {
        console.error("Error fetching biography books:", error);
        res.status(500).json({ message: "Error fetching biography books", error });
    }
});

// Route to fetch books with the highest ratings
// Route to fetch books with the highest ratings
app.get("/rating", async (req, res) => {
    try {
        // Default query to ensure the API has a filter for sorting
        const defaultQuery = "all books";

        // Fetch books sorted by rating in descending order, with the highest rating at the top
        const { data, quota } = await fetchBooks({
            query: defaultQuery, // Default query to comply with API requirements
            sort: "rating", // Sort by rating
            "sort-direction": "DESC", // Descending order
            number: 10, // Limit results to 10
        });

        res.json({ data, quota });
    } catch (error) {
        console.error("Error fetching highest-rated books:", error);
        res.status(500).json({ message: "Error fetching highest-rated books", error });
    }
});


// Route to fetch grouped results (recommendations)
// Route to fetch grouped results (recommendations)
app.get("/group-results", async (req, res) => {
    try {
        // Use the user-provided query or a default query if missing
        const { query = "all books" } = req.query;

        // Fetch grouped book results
        const { data, quota } = await fetchBooks({
            query, // Query parameter, either user-provided or default
            "group-results": true, // Enable grouping of similar editions
            sort: "rating", // Sort by rating for better recommendations
            "sort-direction": "DESC", // Sort in descending order
            number: 10, // Limit results to 10
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
