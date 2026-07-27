import { Link } from "react-router-dom";
import Logo from "../logo/Logo";
import "./LandingNavbar.css";

function LandingNavbar() {
  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Logo />
      </div>

      <div className="navbar-center">
        <ul>

          <li>
            <a href="#features">Features</a>
          </li>

          <li>
            <a href="#about">About</a>
          </li>
          
          <li>
            <a href="#contact">Contact</a>
          </li>

        </ul>
      </div>

      <div className="navbar-right">
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default LandingNavbar;
