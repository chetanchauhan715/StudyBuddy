import { Link } from "react-router-dom";
import "./Hero.css";
import heroImage from "../../assets/illustration_studybuddy.png";

function Hero() {
  return (
    <section className="hero-section page-container">

      <div className="hero-left">

        <h1>
          Track Your Study.
          <br />
          Improve Every Day.
        </h1>

        <p>
          Plan, track and analyze your study sessions in one beautiful
          dashboard designed to keep you focused and productive.
        </p>

        <div className="hero-actions">
          <Link className="primary-btn" to="/signup">
            Get Started
          </Link>

          <a className="secondary-btn" href="#features">
            Learn More
          </a>
        </div>

        <div className="hero-stats">

  <div className="hero-stat app-card">
    <h3>5000+</h3>
    <p>Study Sessions</p>
  </div>

  <div className="hero-stat app-card">
    <h3>100+</h3>
    <p>Active Learners</p>
  </div>

  <div className="hero-stat app-card">
    <h3>4.9★</h3>
    <p>User Rating</p>
  </div>

</div>

      </div>

      <div className="hero-right">
        <img src={heroImage} alt="StudyBuddy Hero Illustration" />
      </div>

    </section>
  );
}

export default Hero;