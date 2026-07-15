import { useNavigate } from "react-router-dom";



function Dashboard(){

    const navigate = useNavigate();

    function handleLogout(){
        
       localStorage.removeItem("token");
       navigate("/login");

       

    }
    return(

        <>
        <h1>Dashboard</h1>

        <button onClick={handleLogout}>
            LogOut
        </button>
        </>
    )

}

export default Dashboard;