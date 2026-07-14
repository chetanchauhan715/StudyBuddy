import { Link } from "react-router-dom";
import "./Hero.css";
import heroImage from "../../assets/illustration_studybuddy.png";
function Hero() {
  return (
    <div className="hero-section">
      <div className="hero-left">
        <div className="hero-content">
          <h1>Track Your Study . Improve Everyday </h1>
          <p>
            Plan , Track and Analyze your study sessions in one beatiful
            dashboard
          </p>
        </div>

        <div className="hero-actions">
          <Link className="primary-btn" to="/signup">
            Get Started
          </Link>

          <a className="secondary-btn" href="#features">
            Learn More
          </a>
        </div>
      </div>

      <div className="hero-right">
    <img src={heroImage} alt="Hero Illustration" />
</div>
    </div>
  );
}

export default Hero;
