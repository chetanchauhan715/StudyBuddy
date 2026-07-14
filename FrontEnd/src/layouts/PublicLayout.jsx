import { Outlet } from "react-router-dom";
import Logo from "../components/logo/Logo"
function PublicLayout(){
    return (
        <>
        <Logo/>
        <Outlet />
        

        {/* <footer>© StudyBuddy</footer> */}
        </>
    );
}

export default PublicLayout;