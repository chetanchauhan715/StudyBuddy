import Logo from "../logo/Logo";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="page-container footer-top">

        <div className="footer-brand">
          <Logo />

          <p>
            Plan your study sessions, track your progress, and build
            consistent learning habits with StudyBuddy.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="footer-contact">
          <h3>Connect</h3>

          <a href="mailto:chetan99256@gmail.com">
            📧 Email
          </a>

          <a
            href="https://github.com/chetanchauhan715"
            target="_blank"
            rel="noopener noreferrer"
          >
            💻 GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/chetan-chauhan-879746231/"
            target="_blank"
            rel="noopener noreferrer"
          >
            💼 LinkedIn
          </a>

        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} StudyBuddy • Built with ❤️ by Chetan Chauhan
      </div>

    </footer>
  );
}

export default Footer;