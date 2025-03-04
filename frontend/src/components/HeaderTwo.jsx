import "./HeaderTwo.css";
import { Link } from "react-router-dom";

export const HeaderTwo = () => {
  return (
    <header className="HeaderTwo">
      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/mypage" className="nav-link">
          My Page
        </Link>
        <Link to="/" className="nav-link">
          Sign Out
        </Link>
      </div>
      <div className="header-content2">
        <h1>A reader lives a thousand lives</h1>
        <p>The man who never reads lives only one.</p>
      </div>
    </header>
  );
};

export default HeaderTwo;
