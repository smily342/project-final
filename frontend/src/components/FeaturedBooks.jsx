import "./FeaturedBooks.css";

export function FeaturedBooks({ books }) {
  if (!books || books.length === 0) {
    return <div>No featured books available.</div>;
  }

  return (
    <section className="featured-books-section">
      <div className="featured-books-container">
        {books.map((book) => (
          <div className="featured-book-card" key={book.id}>
            {book.coverImage && (
              <img
                className="featured-book-cover"
                src={book.coverImage}
                alt={`${book.title} cover`}
              />
            )}

            {/* Wrap the text in a container for easier overlay */}
            <div className="featured-book-info">
              <h3 className="featured-book-title">{book.title}</h3>
              {book.author && (
                <p className="featured-book-author">by {book.author}</p>
              )}
              {book.description && (
                <p className="featured-book-description">{book.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
