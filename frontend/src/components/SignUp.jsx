import { Link } from "react-router-dom"; 
import { Footer } from "../components/Footer"; 
import "./SignUp.css";

export const SignUp = () => {
  return (
    <div>
    <div className="SignUp">
      <form className="SignUp-form">
        <h1 className="SignUp-title">Sign Up</h1>
        <input
          type="text"
          placeholder="First and Lastname"
          className="SignUp-input"
        />
        <input
          type="email"
          placeholder="Enter your email"
          className="SignUp-input"
        />
        <input
          type="text"
          placeholder="Choose Username"
          className="SignUp-input"
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="SignUp-input"
        />
        <input
          type="password"
          placeholder="Repeat your password"
          className="SignUp-input"
        />
        <div className="SignUp-checkbox">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">I agree to terms</label>
        </div>
        <button type="submit" className="SignUp-button">
          SIGN UP
        </button>
        <p className="SignUp-footer">
          Already have an account? <Link to="/">Log In</Link>
        </p>
      </form>
    </div>
          <Footer />
          </div>

  );
};

export default SignUp;
