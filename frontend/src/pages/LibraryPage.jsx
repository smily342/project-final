import { useDocumentTitle } from "../useDocumentTitle"; // Import the hook
import { HeaderTwo } from "../components/HeaderTwo";
import { ExploreBooks } from "../components/ExploreBooks";
import { Footer } from "../components/Footer";
import "./LibraryPage.css";

export const LibraryPage = () => {
  useDocumentTitle("Library - Readers Compass"); // Set the document title

  return (
    <div>
      <HeaderTwo />
      <ExploreBooks />
      <Footer />
    </div>
  );
};

export default LibraryPage;
