import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Landing from "./pages/Landing"
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";
import StudySessions from "./pages/StudySessions"
import Statistics from "./pages/Statistics";
import ProfilePage from "./pages/ProfilePage";

import  {Toaster} from "react-hot-toast";

function App(){
  return (
    
    <>
    <Toaster
    position="top-right"
  toastOptions={{
    duration: 3000,
  }}
    />

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

      <Route element={<AppLayout/>}>  
      
      <Route 

      path="dashboard"
      element={<Dashboard/>}/>

      <Route 
      path="study-sessions"
      element={<StudySessions/>} 
      />

      <Route 
      path="statistics"
      element={<Statistics/>}
      />

      <Route 
      path="profile"
      element={<ProfilePage/>}
      />

      </Route>

    </Route>


</Routes>

</>
    
  );
}

export default App;