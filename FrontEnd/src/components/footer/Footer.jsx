import Logo from "../logo/Logo"
import { Link } from "react-router-dom";
import "./Footer.css"
function Footer() {

  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-brand">
          <Logo />
          <p>Track your study sessions,
analyze your progress,
and build consistent learning habits.</p>
        </div>

        <div className="footer-links">
            <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-contact">
        <h3>Connect</h3>

          <a href="mailto:your@email.com">Email</a>

          <a
            href="https://github.com/..."
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>

      </div>

      <div className="footer-bottom">
        <span>© 2026 StudyBuddy</span>
      </div>
    </footer>
  );
}

export default Footer;
