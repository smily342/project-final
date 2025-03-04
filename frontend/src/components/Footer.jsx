import "./Footer.css";
import { FaInstagram } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="Footer">
      <div className="Footer-content">
        <p className="Footer-text">
          contact@readerscompass.com  |  © 2025 Readers Compass
        </p>
        <div className="Footer-socials">
          <FaInstagram className="social-icon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
