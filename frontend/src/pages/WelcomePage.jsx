import { HeaderOne } from "../components/HeaderOne";
import { Footer } from "../components/Footer";
import { LogIn } from "../components/LogIn";
import useDocumentTitle from "../useDocumentTitle"; // Import the custom hook
import "./WelcomePage.css";

export function WelcomePage() {
  useDocumentTitle("Welcome to Readers Compass"); // Set the title

  return (
    <div className="welcome-page">
      <div className="welcome-page__background"></div>

      {/* Page content */}
      <div className="welcome-page__content">
        <HeaderOne />
        <LogIn />
        <Footer />
      </div>
    </div>
  );
}

export default WelcomePage;
