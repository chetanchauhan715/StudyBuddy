import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../logo/Logo";
import "./Sidebar.css"
import {
    FaHome,
    FaBook,
    FaChartBar,
    FaUser,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";



function Sidebar(){

    const navigate = useNavigate();

    function handleLogout(){
        
        localStorage.removeItem("token");
        navigate("/login");
    }

 
    return (
        <aside className="sidebar">
            <div className="logo">
                <Logo/>
            </div>

            <nav>

            <NavLink to="/dashboard">
                <FaHome />
                Dashboard
            </NavLink>

            <NavLink to="/study-sessions">
                <FaBook/>
                Sessions
            </NavLink>

            <NavLink to="/statistics">
                <FaChartBar/>
                Statistics
            </NavLink>

            <NavLink to="/profile">
                <FaUser/>
                Profile
            </NavLink>

            <NavLink to="/settings">
                <FaCog/>
                Settings
            </NavLink>
            </nav>

            <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt/>
                LogOut
            </button>
        </aside>
    )
}

export default Sidebar;