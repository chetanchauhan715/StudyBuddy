import "./Navbar.css";
import { FaBars, FaBell } from "react-icons/fa";
import Avatar from "../common/Avatar";

function Navbar({sidebarOpen, setSidebarOpen}) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="navbar-container">

      <div className="navbar-left">
        <button className="icon-btn">
          <FaBars 
          className="menu-btn"
          onClick={ ()=> setSidebarOpen(!sidebarOpen)}
          />
        </button>
      </div>

      <div className="navbar-right">

        <button className="icon-btn notification-btn">
          <FaBell />
          <span className="notification-dot"></span>
        </button>

        <div className="navbar-user">
          <Avatar
            name={user?.name}
            size={42}
          />

          <div className="navbar-user-info">
            <span>Hello,</span>
            <h4>{user?.name}</h4>
          </div>
        </div>

      </div>

    </header>
  );
}

export default Navbar;