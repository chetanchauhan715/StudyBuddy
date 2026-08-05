import { LayoutDashboard, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="admin-sidebar">

      <div>
        <div className="sidebar-logo">
          <h2>StudyBuddy</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

        </nav>
      </div>

      <button className="logout-btn">
        <LogOut size={20} />
        <span>Logout</span>
      </button>

    </aside>
  );
}

export default Sidebar;