import "./LogIn.css";
import { Link } from "react-router-dom";

export const LogIn = () => {
  return (
    <div className="LogIn">
      <form className="LogIn-form">
        <h1 className="LogIn-title">Log In</h1>
        <input type="email" placeholder="JaneDoe@hotmail.com" className="LogIn-input" />
        <input type="password" placeholder="Password" className="LogIn-input" />
        <button type="submit" className="LogIn-button">LOG IN</button>
        <p className="LogIn-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link> 
        </p>
      </form>
    </div>
  );
};

export default LogIn;

