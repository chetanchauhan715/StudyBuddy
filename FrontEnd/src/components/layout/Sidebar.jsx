import { NavLink , useNavigate } from "react-router-dom";
import Logo from "../logo/Logo";
import "./Sidebar.css";

import {
  FaHome,
  FaBook,
  FaChartBar,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { useState } from "react";

function Sidebar({ sidebarOpen, setSidebarOpen }) {

  const[showLogoutConfirm , setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setShowLogoutConfirm(false);

    setSidebarOpen(false);

    navigate("/login");
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <>
      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      <aside
        className={
          sidebarOpen
            ? "sidebar open"
            : "sidebar"
        }
      >

        <div className="logo">
          <Logo />
        </div>

        <nav className="sidebar-nav">

          <NavLink
            to="/dashboard"
            onClick={closeSidebar}
          >
            <FaHome />
            Dashboard
          </NavLink>

          <NavLink
            to="/study-sessions"
            onClick={closeSidebar}
          >
            <FaBook />
            Sessions
          </NavLink>

          <NavLink
            to="/statistics"
            onClick={closeSidebar}
          >
            <FaChartBar />
            Statistics
          </NavLink>

          <NavLink
            to="/profile"
            onClick={closeSidebar}
          >
            <FaUser />
            Profile
          </NavLink>

          <NavLink
            to="/settings"
            onClick={closeSidebar}
          >
            <FaCog />
            Settings
          </NavLink>

        </nav>

        <button
          className="logout-btn"
          onClick={ ()=> setShowLogoutConfirm(true)}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </aside>

      {showLogoutConfirm && (
  <div className="logout-confirm-overlay">

    <div className="logout-confirm-modal">

      <h3>Logout from StudyBuddy?</h3>

      <p>
        Are you sure you want to log out of your account?
      </p>

      <div className="logout-confirm-actions">

        <button
          type="button"
          className="secondary-btn"
          onClick={() =>
            setShowLogoutConfirm(false)
          }
        >
          Cancel
        </button>

        <button
          type="button"
          className="logout-confirm-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>

  </div>
)}
    </>
  );
}

export default Sidebar;