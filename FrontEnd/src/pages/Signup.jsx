import { Link } from "react-router-dom";
import "./Signup.css";
function Signup() {
  return (
      <div className="signup-container">
        <h2> Create Account </h2>
        <p>Join StudyBuddy today</p>

        <form>
          <div className="form-group">
            <label htmlFor="name"> Full Name </label>
            <input id="name" type="text" placeholder="Enter Your Name" />
          </div>

          <div className="form-group">
            <label htmlFor="email"> Email </label>
            <input id="email" type="email" placeholder="Enter Your Email" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Your Password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Your Password"
            />
          </div>

          <button type="submit">Create Account</button>

          <div className="auth-footer">
          <p>
            Already have an account?
            <Link to="/login">Login</Link>
          </p>
        </div>

        </form>
      </div>
    
  );
}

export default Signup;
