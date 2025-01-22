
import { useState, useEffect } from "react";
import { FeaturedBooks } from "../components/FeaturedBooks";
import { HeaderOne } from "../components/HeaderOne";
import { Footer } from "../components/Footer"; 
import { LogIn } from "../components/LogIn";
import "./WelcomePage.css";

export function WelcomePage() {
  const [mockBooks, setMockBooks] = useState([
    {
      id: 1,
      title: "Test Book One",
      author: "Jane Doe",
      coverImage: "https://via.placeholder.com/120x180?text=Book+1",
      description: "A quick description for Test Book One."
    },
    {
      id: 2,
      title: "Test Book Two",
      author: "John Smith",
      coverImage: "https://via.placeholder.com/120x180?text=Book+2",
      description: "A short summary of Test Book Two."
    }
  ]);

  return (
    <div className="welcome-page">
      {/* Background Image */}
      <div className="half-page-background" />

      {/* Foreground Content */}
      <HeaderOne />
      <LogIn />
      <FeaturedBooks books={mockBooks} />
      <Footer />
    </div>
  );
}

export default WelcomePage;
