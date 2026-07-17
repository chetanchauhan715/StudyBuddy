import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Landing from "./pages/Landing"
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";

function App(){
  return (
    

      <Routes>

    <Route
        element={<PublicLayout />}
    >

        <Route 
        path="signup"
        element={<Signup/>}
        />

        <Route 
        path="login"
        element={<Login/>}
        />

    </Route>

    <Route
        path="/"

        element={<Landing />}
    />


    <Route element={<ProtectedRoute/>}>

      <Route element={<DashboardLayout/>}>  
      
      <Route 

      path="dashboard"
      element={<Dashboard/>}/>

      </Route>

    </Route>


</Routes>
    
  );
}

export default App;