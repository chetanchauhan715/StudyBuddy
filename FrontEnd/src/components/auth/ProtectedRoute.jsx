import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoute() {
    const token = localStorage.getItem("token");

    console.log("🔥 ProtectedRoute token:", token);

    if (!token) {
        console.log("🚨 ProtectedRoute → LOGIN");
        return <Navigate to="/login" />;
    }

    console.log("✅ ProtectedRoute → ALLOW");
    return <Outlet />;
}

export default ProtectedRoute;