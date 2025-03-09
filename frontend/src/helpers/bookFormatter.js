export function formatBookData(book, fallbackIndex = 0) {
	let imageUrl;

	// If `book.image` is a string
	if (typeof book.image === "string") {
		if (book.image.startsWith("http")) {
			imageUrl = book.image;
		}

		else if (/^\d+$/.test(book.image)) {
			imageUrl = `https://covers.openlibrary.org/b/id/${book.image}-M.jpg`;
		}
		else {
			imageUrl = "default-book.jpg";
		}
	} else {
		imageUrl = "default-book.jpg";
	}

	// Title and author strings
	const titleStr = book.title ? book.title.trim().toLowerCase() : "";
	let authorStr;
	if (book.author) {
		authorStr = book.author;
	} else if (book.authors) {
		authorStr = Array.isArray(book.authors) ? book.authors.join(", ") : book.authors;
	} else {
		authorStr = "Unknown Author";
	}

	// Preserve or generate book ID 
	const id = book.id
		? book.id.toString()
		: `${titleStr}-${authorStr}`.replace(/\s+/g, "-") + `-${fallbackIndex}`;

	// shorten the title if needed
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
