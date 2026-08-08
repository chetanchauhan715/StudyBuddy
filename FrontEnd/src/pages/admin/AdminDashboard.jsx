import { useState,useEffect } from "react";
import { getAdminDashboard } from "../../services/adminService";
import StatCard from "../../components/admin/adminDashoard/StatCard";
import Loader from "../../components/common/Loader";
import RecentUsers from "../../components/admin/adminDashoard/RecentUsers";
import ChartsSection from "../../components/admin/adminDashoard/ChartsSection";
import TopUsers from "../../components/admin/adminDashoard/TopUsers";

import "./AdminDashboard.css";

import {
  Users,
  UserPlus,
  CalendarDays,
  BookOpen,
  Clock3,
} from "lucide-react";



function AdminDashboard(){

    const[dashboardData , setDashboardData]=useState(null);
    const[loading , setLoading]=useState(true);

    
    useEffect( ()=>{
        async function fetchDashboard() {
            try{

                const data = await getAdminDashboard();
            setDashboardData(data);
            }   catch(error){
                console.error(error);
            }finally{
                setLoading(false);
            }
            
        }
        fetchDashboard();
    }, []);


    
     if (loading) {
    return <Loader />;
  }

    const statData =[

    {
        title:"Total Users",
        value:dashboardData.data.totalUsers,
        icon:Users
    },

        
    {
        title:"New Users Today",
        value:dashboardData.data.newUsersToday,
        icon:UserPlus
    },

        
    {
        title:"New Users This Week",
        value:dashboardData.data.newUsersThisWeek,
        icon:CalendarDays
    },

        
    {
        title:"Total Sessions",
        value:dashboardData.data.totalSessions,
        icon:BookOpen
    },

        
    {
        title:"Total Study Hours",
        value:dashboardData.data.totalStudyMinutes / 60,
        icon:Clock3
    },
    
]
 


   return (

    <>
    <section className="admin-dashboard">
        {statData.map( (stat)=> (
            <StatCard  
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            />
        ))}
        
    </section>

    <ChartsSection 
    chartData={dashboardData.data.chartData}
    pieChartData={dashboardData.data.pieChartData}
    />


<div className="users-section">
  <RecentUsers 
recentUsers={dashboardData.data.recentUsers}
/>

<TopUsers 
topUsersData={dashboardData.data.topUsersData}
/>
</div>
  

</>
);

}


export default AdminDashboard;