
/**

 *
 * @param {Object[]} props.books - The array of featured book objects.
 * Each book object could have { id, title, author, coverImage, description } etc.
 */
function FeaturedBooks({ books }) {
  // Fallback if no books are passed
  if (!books || books.length === 0) {
    return <div>No featured books available.</div>;
  }

  return (
    <section className="featured-books-section">
      <h2>Featured Books</h2>
      <div className="featured-books-container">
        {books.map((book) => (
          <div className="featured-book-card" key={book.id}>
            {/* Cover Image */}
            {book.coverImage && (
              <img
                className="featured-book-cover"
                src={book.coverImage}
                alt={`${book.title} cover`}
              />
            )}
            {/* Title */}
            <h3 className="featured-book-title">{book.title}</h3>
            {/* Author */}
            {book.author && (
              <p className="featured-book-author">by {book.author}</p>
            )}
            {/* Description */}
            {book.description && (
              <p className="featured-book-description">{book.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedBooks;
