import { Link , useNavigate} from "react-router-dom";
import "../pages/Login.css";
import { useState } from "react";


function Login() {
  
  const navigate = useNavigate();

  const [formData , setFormData] = useState({
    email:"",
    password:""
  });

const handleChange = (e) =>{
  const {name , value } = e.target;

  setFormData( (prev) => ({
    ...prev , 
    [name]:value,
  }));

};

const handleSubmit = async (e) =>{
  console.log("Handle Submit Called");
  e.preventDefault();
  // console.log(formData);

  try{
  const response = await fetch("http://localhost:3000/login",{
    method:"POST",

    headers:{
      "content-type":"application/json",
    },

    body:JSON.stringify(formData),
  });

  const data = await response.json();
 
  if(response.ok){

    console.log(data.message);
    localStorage.setItem("token", data.data.token);
    navigate("/dashboard");
}else{

    console.log("Login Failed");
    alert(data.message);
}

} catch (error){
  console.error(error);
  alert("Something went wrong. Please try again.");
}

}



  return (
    <>
      {/* <Logo/> */}
      <div className="login-container">
        <h2> Welcome Back </h2>
        <p>Login to Continue</p>

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
