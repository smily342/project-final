import "./LogIn.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export const LogIn = () => {
  return (
    <div className="LogIn">
      <form className="LogIn-form">
        <h1 className="LogIn-title">Log In</h1>
        <input type="email" placeholder="Enter your email" className="LogIn-input" />
        <input type="password" placeholder="Enter your password" className="LogIn-input" />
        <button type="submit" className="LogIn-button">LOG IN</button>
        <p className="LogIn-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link> {/* Use Link to navigate */}
        </p>
      </form>
    </div>
  );
};

export default LogIn;

