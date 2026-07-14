import { Link } from "react-router-dom";
import "../pages/Login.css";
function Login() {
  return (
    <>
      {/* <Logo/> */}
      <div className="login-container">
        <h2> Welcome Back </h2>
        <p>Login to Continue</p>

        <form>
          <div className="form-group">
            <label htmlFor="email"> Email </label>
            <input id="email" type="email" placeholder="Enter Your Email" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter Your Password" />
        
          </div>

          <div className="form-options">
            <div className="remember-me">
                <input type="checkbox" />
                <label htmlFor="">Remeber Me</label>
            </div>

            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?
            <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
