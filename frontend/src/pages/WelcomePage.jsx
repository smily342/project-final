import { HeaderOne } from "../components/HeaderOne";
import { Footer } from "../components/Footer";
import { LogIn } from "../components/LogIn";
import "./WelcomePage.css";

export function WelcomePage() {
  return (
    <div className="welcome-page">
      <div className="welcome-page__background"></div>

      {/* page content  */}
      <div className="welcome-page__content">
        <HeaderOne />
        <LogIn />
        <Footer />
      </div>
    </div>
  );
}

export default WelcomePage;
