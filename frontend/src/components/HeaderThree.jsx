import "./HeaderThree.css";
import { Link } from "react-router-dom";

export const HeaderThree = () => {
  return (
    <header className="HeaderThree">
      {/* Navigation Links */}
      <div className="nav-link-container">
        <Link to="/library" className="nav-link">Explore Books</Link>
        <Link to="/" className="nav-link">Sign Out</Link>
      </div>
      <div className="header-content3">
        <h1>My Page</h1>
      </div>
    </header>
  );
};

export default HeaderThree;

