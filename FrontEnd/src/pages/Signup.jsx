import { Link ,useNavigate } from "react-router-dom";
import "./Signup.css";
import { useState } from "react";
import toast from "react-hot-toast";


function Signup() {

  const navigate = useNavigate();

  const [formData , setFormData] = useState( {
    name:"",
    email:"",
    password:"",
    confirmPassword:""
    
  });

  const [loading , setLoading]= useState(false);

  const handleChange = (e) =>{
    const {name , value} = e.target;

    setFormData( (prev)=> ({
      ...prev , 
      [name]:value
    }));
  }

  const signupData = {
    name:formData.name,
    email:formData.email,
    password:formData.password
  } ;

  const handleSubmit = async (e) =>{
    e.preventDefault();

    // FrontEnd validatin 
    if(formData.password !== formData.confirmPassword){
      toast.error("Password do not match");
      return;
    }


    // API call 
    try{
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup` , {
        method:"POST" ,

        headers:{
          "content-type":"application/json",
        },

        body:JSON.stringify(formData)
      });

      const data = await response.json()

      if(response.ok){
       toast.success("Account created succesfully");
        navigate("/login")
      } else {
       toast.error(data.message);
      }
    } catch (error){
      console.error(error);
      toast.error("Something went wrong");
  } finally{
    setLoading(false);
  }

  }


  return (
      <div className="signup-container">

        
        
        <h2> Create Your Account 🚀 </h2>
        <p>Start your learning journey with StudyBuddy</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name"> Full Name </label>
            <input 
            name="name"
            id="name"
             type="text"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={handleChange}
               />
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <input
            name="confirmPassword"
              id="confirmPassword"
              type="password"
              placeholder="Confirm Your Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
           className="primary-btn"
            type="submit"
            disabled={loading}
            >
              {loading? "Creating Account..." : "Create Account"}
          </button>

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
