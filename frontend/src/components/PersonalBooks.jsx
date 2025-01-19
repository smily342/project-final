import { useState } from "react";
import "./PersonalBooks.css"; 

export function PersonalBooks() {
  const [selectedCategory, setSelectedCategory] = useState("saved");

  // Temporary data (replace with our API later)
  const savedBooks = [
    {
      id: 1,
      coverImage: "https://via.placeholder.com/120x180?text=Saved+1",
      title: "Read Freely",
      author: "Fatima Souza",
    },
    {
      id: 2,
      coverImage: "https://via.placeholder.com/120x180?text=Saved+2",
      title: "Ocean Life",
      author: "John Marine",
    },
    {
      id: 3,
      coverImage: "https://via.placeholder.com/120x180?text=Saved+2",
      title: "Ocean Life",
      author: "John Marine",
    },
    {
      id: 4,
      coverImage: "https://via.placeholder.com/120x180?text=Saved+2",
      title: "Ocean Life",
      author: "John Marine",
    },
  ];

  const likedBooks = [
    {
      id: 5,
      coverImage: "https://via.placeholder.com/120x180?text=Liked+1",
      title: "Arigatou Gozaimas",
      author: "Robert Iger",
    },
    {
      id: 6,
      coverImage: "https://via.placeholder.com/120x180?text=Liked+2",
      title: "Sky High",
      author: "Amelia Flight",
    },
    {
      id: 7,
      coverImage: "https://via.placeholder.com/120x180?text=Saved+2",
      title: "Ocean Life",
      author: "John Marine",
    },
    {
      id: 8,
      coverImage: "https://via.placeholder.com/120x180?text=Saved+2",
      title: "Ocean Life",
      author: "John Marine",
    },
  ];

  const recommendedBooks = [
    {
      id: 9,
      coverImage: "https://via.placeholder.com/120x180?text=Recom+1",
      title: "Embrace The Wild",
      author: "Sara Anderson",
    },
    {
      id: 10,
      coverImage: "https://via.placeholder.com/120x180?text=Recom+2",
      title: "Galaxy Party Here",
      author: "Koga Farescar",
    },
    {
      id: 12,
      coverImage: "https://via.placeholder.com/120x180?text=Saved+2",
      title: "Ocean Life",
      author: "John Marine",
    },
    {
      id: 13,
      coverImage: "https://via.placeholder.com/120x180?text=Saved+2",
      title: "Ocean Life",
      author: "John Marine",
    },
  ];

  // Boks displayed based on selected category
  const getDisplayedBooks = () => {
    if (selectedCategory === "saved") return savedBooks;
    if (selectedCategory === "liked") return likedBooks;
    return recommendedBooks; 
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
              <p className="book-title">{book.title}</p>
              <p className="book-author">By {book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
