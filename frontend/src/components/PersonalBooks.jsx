import { useState } from "react";
import "./PersonalBooks.css"; // We'll define the styles here

export function PersonalBooks() {
  // Track which category is selected
  const [selectedCategory, setSelectedCategory] = useState("saved");

  // Temporary mock data (replace with actual API data later)
  const savedBooks = [
    {
      id: 1,
      coverImage: "https://via.placeholder.com/120x180?text=Saved+1",
      title: "Read Freely",
      author: "Fatima Souza",
      price: 45.0
    },
    {
      id: 2,
      coverImage: "https://via.placeholder.com/120x180?text=Saved+2",
      title: "Ocean Life",
      author: "John Marine",
      price: 30.0
    },
  ];

  const likedBooks = [
    {
      id: 3,
      coverImage: "https://via.placeholder.com/120x180?text=Liked+1",
      title: "Arigatou Gozaimas",
      author: "Robert Iger",
      price: 19.0
    },
    {
      id: 4,
      coverImage: "https://via.placeholder.com/120x180?text=Liked+2",
      title: "Sky High",
      author: "Amelia Flight",
      price: 39.0
    },
  ];

  const recommendedBooks = [
    {
      id: 5,
      coverImage: "https://via.placeholder.com/120x180?text=Recom+1",
      title: "Embrace The Wild",
      author: "Sara Anderson",
      price: 39.0
    },
    {
      id: 6,
      coverImage: "https://via.placeholder.com/120x180?text=Recom+2",
      title: "Galaxy Party Here",
      author: "Koga Farescar",
      price: 49.0
    },
  ];

  // Determine which books to display based on the selected category
  const getDisplayedBooks = () => {
    if (selectedCategory === "saved") return savedBooks;
    if (selectedCategory === "liked") return likedBooks;
    return recommendedBooks; // default to "Recommendations"
  };

  const displayedBooks = getDisplayedBooks();

  return (
    <div className="personal-books">
      {/* Category Buttons */}
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

      {/* Books Row */}
      <div className="books-row">
        {displayedBooks.map((book) => (
          <div className="book-card" key={book.id}>
            <img className="book-cover" src={book.coverImage} alt={book.title} />
            <div className="book-info">
              <p className="book-price">${book.price.toFixed(2)}</p>
              <p className="book-title">{book.title}</p>
              <p className="book-author">By {book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
