import { HeaderTwo } from "../components/HeaderTwo";
import { ExploreBooks } from "../components/ExploreBooks";
import { Footer } from "../components/Footer";
import "./LibraryPage.css";



export const LibraryPage = () => {
  return (
    <div>
      <HeaderTwo />
      <ExploreBooks />
      <Footer />
    </div>
  );
};

export default LibraryPage;