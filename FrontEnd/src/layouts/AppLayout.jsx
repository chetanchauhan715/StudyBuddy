import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "./DashboardLayout.css";

function AppLayout(){
    return(
        <>
        <Navbar/>

        <div className="dashboard-layout">
        <Sidebar/>

        <main>
        <Outlet/>
        </main>
        
        </div>
        
        </>
    )
}

export default AppLayout;