import { useState } from "react";
import { forgotPassword } from "../services/authService";
import toast from "react-hot-toast";

import "./ForgotPassword.css";


function ForgotPassword(){

    const[email , setEmail] = useState("");
    const[loading , setLoading]= useState(false);

    async function  handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
    toast.error("Please enter your email");
    return;
  }

    try{
        setLoading(true);

        await forgotPassword({email});

    toast.success("Reset email sent succesfully");

    setEmail("");
    } catch(error){
        console.error(error);

        toast.error(
        error.response?.data?.message || "Something went wrong"
    );

    }finally{
        setLoading(false);
    }
}


   
    return (
        <section className="forgot-password-container">

            <div className="forgot-password-header">
                <h2>Forgot Password 🔑</h2>
                <p>
  Enter your email and we'll send you a password reset link.
</p>
            </div>

            <form onSubmit={handleSubmit} className="forgot-password-form">
            <label htmlFor="email"> Enter your email</label>
            <input 
            id="email"
            type="email"
            disabled={loading}
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />

            <button 
            className="primary-btn"
             type="submit"
             disabled={loading}
             >
               {loading? "Sending Email..." : "Reset Password"}
            </button>
            </form>

            
        </section>
    )
}

export default ForgotPassword;