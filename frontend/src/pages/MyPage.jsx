import { useDocumentTitle } from "../useDocumentTitle"; // Import the hook
import { HeaderThree } from "../components/HeaderThree";
import { PersonalBooks } from "../components/PersonalBooks";
import { Footer } from "../components/Footer";
import "./MyPage.css";

export const MyPage = () => {
  useDocumentTitle("My Page - Readers Compass"); // Set the document title

  return (
    <div className="page-wrapper">
      <HeaderThree />
      <div className="content-wrapper">
        <PersonalBooks />
      </div>
      <Footer />
    </div>
  );
};

export default MyPage;
