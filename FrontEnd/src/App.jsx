import { Route, Routes } from "react-router-dom";

function App(){
  return (
    <div>
      <h1>StudyBuddy</h1>

      <Routes>

      <Route 
      path="/"
      element={<Landing/>}
      />

      <Route 
      path="/singup"
      element={<Signup/>}
        />

      <Route path="/login"
      element={<Login/>}
      />

      </Routes>
    </div>
  );
}

export default App;