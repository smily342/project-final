import React from "react";
import "./Footer.css";
import { FaInstagram } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="Footer">
      <div className="Footer-content">
        {/* Left Content */}
        <div className="Footer-left">
          <p>contact@readerscompass.com</p>
        </div>

        {/* Center Content */}
        <div className="Footer-center">
          <p>© 2025 Readers Compass</p>
        </div>

        {/* Right Content */}
        <div className="Footer-socials">
          <FaInstagram className="social-icon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;


