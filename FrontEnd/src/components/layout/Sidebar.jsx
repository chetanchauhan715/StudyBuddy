import { NavLink, useNavigate } from "react-router-dom";
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

function Sidebar({ sidebarOpen, setSidebarOpen }) {

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");

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
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </aside>
    </>
  );
}

export default Sidebar;