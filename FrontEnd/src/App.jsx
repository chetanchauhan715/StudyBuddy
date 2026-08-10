import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";

import { Toaster } from "react-hot-toast";

import Loader from "./components/common/Loader";


// Lazy Loaded Pages
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudySessions = lazy(() => import("./pages/StudySessions"));
const Statistics = lazy(() => import("./pages/Statistics"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const Settings = lazy(() => import("./pages/Settings"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const AdminDashboard = lazy( ()=> import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy( ()=> import("./pages/admin/AdminUsers"));

function App(){
  return (
    
    <>
    <Toaster
    position="top-right"
  toastOptions={{
    duration: 3000,
  }}
    />

     <Suspense fallback={<Loader/>}>

    <Routes > 

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

        <Route 
        path="forgot-password"
        element={<ForgotPassword />}
        />

        <Route
        path="reset-password/:token"
        element={<ResetPassword/>}
        />


    </Route>

    <Route
        path="/"

        element={<Landing />}
    />

 

 {/* ---------------- */}
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

      <Route 
      path="settings"
      element={<Settings/>}
      />

      </Route>

      {/* ------- */}

    <Route path="/admin" element={<AdminLayout/>}>

    <Route path="dashboard" element={<AdminDashboard/>} />

    <Route  path="users" element={<AdminUsers/>} />

    </Route>


    </Route>

     


</Routes>

</Suspense>

</>
    
  );
}

export default App;