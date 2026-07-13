import { Outlet } from "react-router-dom";
function PublicLayout(){
    return (
        <>
        <header>StudyBuddy</header>

        <Outlet />
        

        <footer>© StudyBuddy</footer>
        </>
    );
}

export default PublicLayout;