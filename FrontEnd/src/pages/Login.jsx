import { Link , useNavigate} from "react-router-dom";
import "../pages/Login.css";
import { useState } from "react";
import toast from "react-hot-toast";

function Login() {
  
  const navigate = useNavigate();

  const [formData , setFormData] = useState({
    email:"",
    password:""
  });

  const [loading , setLoading] = useState(false);

const handleChange = (e) =>{
  const {name , value } = e.target;

  setFormData( (prev) => ({
    ...prev , 
    [name]:value,
  }));

};

const handleSubmit = async (e) =>{
 
  e.preventDefault();
  
  try{
    setLoading(true);
  const response = await fetch(`${import.meta.env.VITE_API_URL}/login`,{
    method:"POST",

    headers:{
      "content-type":"application/json",
    },

    body:JSON.stringify(formData),
  });

  const data = await response.json();
 
  if(response.ok){

    
    localStorage.setItem("token", data.data.token);

    localStorage.setItem("user" , JSON.stringify( data.data.user));

    toast.success("Login succesfull !");

    navigate("/dashboard");
}else{

    toast.error("Password do not match");
}

} catch (error){
  console.error(error);
  toast.error("Something went wrong. Please try again");
} finally{
  setLoading(false);
}

}



  return (
    <>
      
      <div className="login-container">

        
        <h2> Welcome Back  👋 </h2>
        <p>Sign in to continue your learning journey.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email"> Email </label>
            <input
             name="email"
              id="email" 
              type="email" 
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
             name="password"  
             type="password"
             id="password"
             placeholder="Enter Your Password"
             value={formData.password}
             onChange={handleChange}
               />
        
          </div>

          <div className="form-options">
            <div className="remember-me">
                <input type="checkbox" />
                <label htmlFor="">Remeber Me</label>
            </div>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
           className="primary-btn"
            type="submit"
            disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
          </button>
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
