import { HeaderOne } from "../components/HeaderOne";
import { Footer } from "../components/Footer";
import { LogIn } from "../components/LogIn";
import useDocumentTitle from "../useDocumentTitle";
import "./WelcomePage.css";

const WelcomePage = () => {
  useDocumentTitle("Welcome to Readers Compass");

  return (
    <div className="welcome-page">
      <div className="welcome-page__background" />
      <div className="welcome-page__content">
        <HeaderOne />
        <LogIn />
        <Footer />
      </div>
    </div>
  );
};

export default WelcomePage;
