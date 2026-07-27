import "./Navbar.css";
import { FaBars , FaBell } from "react-icons/fa";

import Avatar from "../common/Avatar";

function Navbar(){

    const user = JSON.parse(localStorage.getItem("user"));
    return(
        
        <nav className="navbar-container">

        <div className="navbar-left">
            <FaBars/>
        </div>

        <div className="navbar-right">
        <FaBell/>
        <Avatar
        name={user?.name}
        size={42}
        />
        </div>

        </nav>

    )
}

export default Navbar;