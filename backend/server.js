import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import booksRoutes from "./Routes/bookroutes.js";
import categoriesRoutes from "./Routes/categoryRoutes.js";
import recommendationsRoutes from "./Routes/recommendationRoutes.js";

dotenv.config(); 

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

mongoose.Promise = Promise; 

const port = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// ROUTES 
app.use("/books", booksRoutes);
app.use("/categories", categoriesRoutes);
app.use("/recommendations", recommendationsRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
