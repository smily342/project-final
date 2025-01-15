import "./ExploreBooks.css"; 

// Temporary books array
const books = [
  { title: "Read Freely", image: "book1.jpg" },
  { title: "Arigatô", image: "book2.jpg" },
  { title: "Embrace the Wild", image: "book3.jpg" },
  { title: "Galaxy", image: "book4.jpg" },
];

export function ExploreBooks() {
  return (
    <>
      {/* Categories*/}
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
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default ExploreBooks;