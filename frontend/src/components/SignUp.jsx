import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import "./SignUp.css";

export const SignUp = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm();

	const navigate = useNavigate();
	const password = watch("password");

	const onSubmit = async (data) => {
		const nameParts = data.fullName.trim().split(" ");
		const firstName = nameParts[0];
		const lastName = nameParts.slice(1).join(" ") || "";

		// Build modified data object to send to the backend
		const modifiedData = {
			firstName,
			lastName,
			email: data.email,
			password: data.password,
		};

		try {
			const response = await fetch("https://project-final-044d.onrender.com/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(modifiedData),
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.message || "Something went wrong");
			}

			// Redirect to library-page after signup
			navigate("/library");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			<div className="SignUp">
				<form className="SignUp-form" onSubmit={handleSubmit(onSubmit)}>
					<h1 className="SignUp-title">Sign Up</h1>

					{/* Full Name Input */}
					<input
						type="text"
						placeholder="First and Lastname"
						className="SignUp-input"
						{...register("fullName", { required: "Full name is required" })}
					/>
					{errors.fullName && (
						<p className="error">{errors.fullName.message}</p>
					)}

					{/* Email */}
					<input
						type="email"
						placeholder="Enter your email"
						className="SignUp-input"
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^\S+@\S+\.\S+$/,
								message: "Invalid email format",
							},
						})}
					/>
					{errors.email && <p className="error">{errors.email.message}</p>}

					{/* Password */}
					<input
						type="password"
						placeholder="Enter your password"
						className="SignUp-input"
						{...register("password", {
							required: "Password is required",
							minLength: {
								value: 6,
								message: "Password must be at least 6 characters long",
							},
						})}
					/>
					{errors.password && (
						<p className="error">{errors.password.message}</p>
					)}

					{/* Confirm Password */}
					<input
						type="password"
						placeholder="Repeat your password"
						className="SignUp-input"
						{...register("repeatPassword", {
							required: "Please confirm your password",
							validate: (value) => value === password || "Passwords do not match",
						})}
					/>
					{errors.repeatPassword && (
						<p className="error">{errors.repeatPassword.message}</p>
					)}

					{/* Terms and Conditions Checkbox */}
					<div className="SignUp-checkbox">
						<input
							type="checkbox"
							id="terms"
							{...register("terms", { required: "You must accept the terms" })}
						/>
						<label htmlFor="terms">I agree to terms</label>
					</div>
					{errors.terms && <p className="error">{errors.terms.message}</p>}

					{/* Submit Button */}
					<button type="submit" className="SignUp-button" disabled={isSubmitting}>
						{isSubmitting ? "Signing Up..." : "SIGN UP"}
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
