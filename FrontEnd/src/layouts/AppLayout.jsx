import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "./AppLayout.css";
import { useState } from "react";

function AppLayout() {

    const [sidebarOpen , setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar 
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      />

      <div className="app-layout">

        <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        />

        <main className="app-main page-container">
          <Outlet />
        </main>

      </div>
    </>
  );
}

export default AppLayout;