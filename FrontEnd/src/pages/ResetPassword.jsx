import "./ResetPassword.css";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";
import toast from "react-hot-toast";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPasswrod] = useState("");

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      toast.success("Password Change succesfully");

      navigate("/login");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <section className="reset-password-container">
      <div>
        <h2>Create New Password 🔒</h2>

        <p>Enter your new password below to secure your account.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="newPassword">Enter new password</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPasswrod(e.target.value)}
        />

        <button className="primaty-btn" type="submit">
          Reset Password
        </button>
      </form>
    </section>
  );
}

export default ResetPassword;
