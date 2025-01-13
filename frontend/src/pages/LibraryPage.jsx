import React from 'react';
import './LibraryPage.css';

const books = [
  { title: 'Read Freely', price: '$48.00', image: 'book1.jpg' },
  { title: 'Arigatou', price: '$39.00', image: 'book2.jpg' },
  { title: 'Embrace the Wild', price: '$28.00', image: 'book3.jpg' },
  { title: 'Galaxy', price: '$45.00', image: 'book4.jpg' },
];

const LibraryPage = () => {
  return (
    <div className="library-page">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <h1>A reader lives a thousand lives</h1>
          <p>The man who never reads lives only one.</p>
        </div>
        <div className="header-picture">
          <div className="picture-box">Picture</div>
        </div>
      </header>

      {/* Categories Section */}
      <section className="categories">
        <h2>Explore Categories</h2>
        <div className="category-buttons">
          <button>Fiction</button>
          <button>Romance</button>
          <button>Crime</button>
          <button>Biography</button>
        </div>
      </section>

      {/* Book Display Section */}
      <section className="book-display">
        <h2>What Will You Discover?</h2>
        <div className="books-grid">
          {books.map((book, index) => (
            <div className="book" key={index}>
              <img src={book.image} alt={book.title} />
              <p>{book.title}</p>
              <span>{book.price}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LibraryPage;
