import { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import "./SignUp.css";

export const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }

    const nameParts = fullName.trim().split(" ");
    if (nameParts.length < 2) {
      setError("Please provide both first and last name.");
      return;
    }
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    if (!email) {
      setError("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();
      setIsLoading(false); // Stop loading

      if (!response.ok) {
        setError(data.message || "Something went wrong during signup.");
        setSuccess("");
      } else {
        setSuccess("User registered successfully!");
        setError("");
        setFullName("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");
      }
    } catch (err) {
      setIsLoading(false); // Stop loading
      setError("Unable to connect to the server. Please try again later.");
      setSuccess("");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="SignUp">
        <form className="SignUp-form" onSubmit={handleSubmit}>
          <h1 className="SignUp-title">Sign Up</h1>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <input
            type="text"
            placeholder="First and Lastname"
            className="SignUp-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="SignUp-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="SignUp-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Repeat your password"
            className="SignUp-input"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          <div className="SignUp-checkbox">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">I agree to terms</label>
          </div>
          <button type="submit" className="SignUp-button" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "SIGN UP"}
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
