import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true, // Use the new URL string parser
    useUnifiedTopology: true, // Use the new topology engine
  })
  .then(() => console.log("Connected to MongoDB")) // Log success message
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message); // Log error message
    process.exit(1); // Exit the process with failure
  });

mongoose.Promise = Promise; // Use JavaScript Promises with Mongoose

const port = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON data in incoming requests

// Test route
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
