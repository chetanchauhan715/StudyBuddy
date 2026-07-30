import { useState } from "react"
import { changePassword } from "../../services/profileService";
import toast from "react-hot-toast";

import "./ChangePasswordCard.css";

function ChangePasswordCard(){

    const[currentPassword , setCurrentPassword]= useState("");
    const[newPassword, setNewPassword]= useState("");
    const[confirmPassword , setConfirmPassword]=useState("");

    const[error , setError]= useState("");
    const[loading, setLoading]=useState(false);

    async function handleSubmit(e) {
        console.log("Submit Clicked");
        e.preventDefault();

        try{
            setLoading(true);
            setError("");

            await changePassword({
                currentPassword ,
                newPassword,
                confirmPassword
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password updated succesfully");
            
        } catch(error){
            console.log(error);
            setError(error.response.data.message) || "Something went wrong";
        }finally{
            setLoading(false);
        }
    }

    function onClose(){
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
    }

    return (
        <div className="change-password-card">
    <h2>🔒 Change Password</h2>

    <form onSubmit={handleSubmit} className="change-password-form">

        <div className="input-group">
            <label>Current Password</label>
            <input
            type="password"
            value={currentPassword}
            onChange={ (e)=> setCurrentPassword(e.target.value)}
            />
        </div>

        <div className="input-group">
            <label>New Password</label>
            <input 
            type="password"
            value={newPassword}
            onChange={ (e)=> setNewPassword(e.target.value)}
            />
        </div>

        <div className="input-group">
            <label>Confirm Password</label>
            <input 
            type="password"
            value={confirmPassword}
            onChange={(e)=> setConfirmPassword(e.target.value)}
            />
        </div>

        {error && (
            <p className="error-message">
                {error}
            </p>
        )}

        <div className="password-buttons">
            <button
                type="submit"
                disabled={loading}
                className="save-btn"
            >
                {loading ? "Updating..." : "Update Password"}
            </button>

            <button
                type="button"
                onClick={onClose}
                className="cancel-btn"
            >
                Cancel
            </button>
        </div>

    </form>
</div>
    )
}
export default ChangePasswordCard;