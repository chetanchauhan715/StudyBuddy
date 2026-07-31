import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "./AppLayout.css";

function AppLayout() {
  return (
    <>
      <Navbar />

      <div className="app-layout">

        <Sidebar />

        <main className="app-main page-container">
          <Outlet />
        </main>

      </div>
    </>
  );
}

export default AppLayout;