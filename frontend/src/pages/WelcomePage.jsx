import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FeaturedBooks } from "../components/FeaturedBooks";
import { HeaderOne } from "../components/HeaderOne";
import { Footer } from "../components/Footer"; 
import { LogIn } from "../components/LogIn";


/* function to test the featured books without our backend */
export function WelcomePage() {
  // Mock data for testing
  const [mockBooks, setMockBooks] = useState([
    {
      id: 1,
      title: "Test Book One",
      author: "Jane Doe",
      coverImage: "https://via.placeholder.com/120x180?text=Book+1",
      description: "A quick description for Test Book One.",
    },
    {
      id: 2,
      title: "Test Book Two",
      author: "John Smith",
      coverImage: "https://via.placeholder.com/120x180?text=Book+2",
      description: "A short summary of Test Book Two.",
    },
  ]);

  return (
    <div>
      {/* Render Header */}
      <HeaderOne />

       {/* Render LogIn */}
       <LogIn />

      {/* Render Featured Books */}
      <FeaturedBooks books={mockBooks} />

           {/* Render Footer */}
      <Footer />
    </div>
  );
}

export default WelcomePage;