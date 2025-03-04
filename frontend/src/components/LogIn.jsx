import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import "./LogIn.css";

export const LogIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("https://project-final-044d.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Login failed");
      }

      localStorage.setItem("token", responseData.token);
      navigate("/library");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="LogIn">
      <form className="LogIn-form" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="LogIn-title">Log In</h1>

        {/* Email Input */}
        <input
          type="email"
          placeholder="JaneDoe@hotmail.com"
          className="LogIn-input"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="LogIn-input"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        {/* Submit Button */}
        <button type="submit" className="LogIn-button" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "LOG IN"}
        </button>

        <p className="LogIn-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default LogIn;
