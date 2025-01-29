
import { useState, useEffect } from "react";
import { HeaderOne } from "../components/HeaderOne";
import { Footer } from "../components/Footer";
import { LogIn } from "../components/LogIn";
import "./WelcomePage.css";

export function WelcomePage() {


  return (
    <div className="welcome-page">
      {/* Background Image */}
      <div className="half-page-background" />

      {/* Foreground Content */}
      <HeaderOne />
      <LogIn />
      <Footer />
    </div>
  );
}

export default WelcomePage;
