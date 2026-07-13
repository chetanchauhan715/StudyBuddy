import {Link} from "react-router-dom";
import Logo from "../logo/Logo"
function LandingNavbar(){
    return (

        <nav>
        <div className="navbar-left">
            <Logo/>
        </div>

        <div className="navbar-center">
            <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </div>

        <div className="navbar-right">
            <Link to="/login">Login</Link>
        </div>

        </nav>

    )
}

export default LandingNavbar;