import { Link } from "react-router-dom";
import Logo from "../logo/Logo";
import "./LandingNavbar.css";

function LandingNavbar() {
  return (
    <nav className="navbar-container">

      <Logo />

      <ul className="navbar-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <Link className="primary-btn" to="/login">
        Login
      </Link>

    </nav>
  );
}

export default LandingNavbar;