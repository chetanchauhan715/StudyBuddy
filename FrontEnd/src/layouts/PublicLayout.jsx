import { Outlet } from "react-router-dom";
import Logo from "../components/logo/Logo";

import "./PublicLayout.css";

function PublicLayout(){
    return (
        <>
        <div className="auth-logo">
        <Logo />
      </div>
        <Outlet />
        

        {/* <footer>© StudyBuddy</footer> */}
        </>
    );
}

export default PublicLayout;