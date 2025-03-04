// src/helpers/bookFormatter.js
export function formatBookData(book, fallbackIndex = 0) {
    let imageUrl;

    // If `book.image` is a string
    if (typeof book.image === "string") {
        // 1. If it starts with "http", assume it's already a correct/complete URL.
        if (book.image.startsWith("http")) {
            imageUrl = book.image;
        }
        // 2. If it's purely numeric (e.g., "1234567"), assume it's an OpenLibrary cover ID.
        else if (/^\d+$/.test(book.image)) {
            imageUrl = `https://covers.openlibrary.org/b/id/${book.image}-M.jpg`;
        }
        // 3. Otherwise, fallback to a default or a known pattern.
        else {
            imageUrl = "default-book.jpg";
        }
    } else {
        // If no image is provided, use a default
        imageUrl = "default-book.jpg";
    }

    // Prepare the title and author strings
    const titleStr = book.title ? book.title.trim().toLowerCase() : "";
    let authorStr;
    if (book.author) {
        authorStr = book.author;
    } else if (book.authors) {
        authorStr = Array.isArray(book.authors) ? book.authors.join(", ") : book.authors;
    } else {
        authorStr = "Unknown Author";
    }

    // Preserve the original `book.id` if it exists, otherwise generate one
    const id = book.id
        ? book.id.toString()
        : `${titleStr}-${authorStr}`.replace(/\s+/g, "-") + `-${fallbackIndex}`;

    // Optionally truncate the title
    const truncateTitle = (t, maxLength = 31) =>
        t && t.length > maxLength ? t.slice(0, maxLength) + "..." : t;

    return {
        id,
        title: truncateTitle(book.title) || "Untitled",
        image: imageUrl,
        author: authorStr,
        genre: book.genre || "Unknown Genre",
    };
}
