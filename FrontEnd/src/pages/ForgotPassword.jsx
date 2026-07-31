import { useState } from "react";
import { forgotPassword } from "../services/authService";
import toast from "react-hot-toast";

import "./ForgotPassword.css";


function ForgotPassword(){

    const[email , setEmail] = useState("");

    async function  handleSubmit(e) {
    e.preventDefault();

    try{
        await forgotPassword({email});

    toast.success("Reset email sent succesfully");

    setEmail("");
    } catch(error){
        console.error(error);

        toast.error(
        error.response?.data?.message || "Something went wrong"
    );

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
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />

            <button className="primary-btn" type="submit">
                Reset Password
            </button>
            </form>

            
        </section>
    )
}

export default ForgotPassword;