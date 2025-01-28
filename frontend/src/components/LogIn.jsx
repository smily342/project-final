import "./LogIn.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/library");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="LogIn">
      <form className="LogIn-form" onSubmit={handleLogin}>
        <h1 className="LogIn-title">Log In</h1>
        {error && <p className="LogIn-error">{error}</p>}
        <input
          type="email"
          placeholder="JaneDoe@hotmail.com"
          className="LogIn-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="LogIn-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="LogIn-button">LOG IN</button>
        <p className="LogIn-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default LogIn;
