import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Signup from "./pages/Singup";
import Login from "./pages/Login";
import Landing from "./pages/Landing"

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

</Routes>
    
  );
}

export default App;