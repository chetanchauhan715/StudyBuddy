import "./Navbar.css";
import { FaBars , FaBell, FaUserCircle } from "react-icons/fa";

function Navbar(){
    return(
        
        <nav className="navbar-container">

        <div className="navbar-left">
            <FaBars/>
        </div>

        {/* <div className="navbar-center">
        <input type="text" placeholder="Search sessions..."/>
        </div> */}

        <div className="navbar-right">
        <FaBell/>
        <FaUserCircle/>
        </div>

        </nav>

    )
}

export default Navbar;