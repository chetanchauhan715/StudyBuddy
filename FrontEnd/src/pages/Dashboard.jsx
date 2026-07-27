import StatsCard from "../components/dashboard/StatsCard";
import { FaBook , FaClock, FaCheckCircle, FaClipboardList } from "react-icons/fa";
import "./Dashboard.css";
import WeeklyStudyChart from "../components/dashboard/WeeklyStudyChart";
import SubjectPieChart from "../components/dashboard/SubjectPieChart";
import RecentSessions from "../components/dashboard/RecentSessions";
import TodayGoalCard from "../components/dashboard/TodayGoalCard";

import { getDashboard } from "../services/dashboardService";

import { useState, useEffect } from "react";

function Dashboard() {
const [dashboard, setDashboard] = useState({
    sessions: {
        totalSessions: 0,
        totalHours: 0,
        completedSessions: 0,
        pendingSessions: 0,
    },
    recentSessions: [],
    weeklyStudy: [],
    subjectData: [],
    todayGoal: {
        completedToday: 0,
    },
    goalHours:0,
    streak: 0,
});

const[loading , setLoading] = useState(true);

useEffect( ()=> {

async function  fetchDashboard() {

  try{
      const data = await getDashboard();
  setDashboard(data);
  setLoading(false);
  } catch(error){
    console.error(error);
    
  }
  
}
fetchDashboard();

},[]);


const totalStudyHours = Math.floor(dashboard.sessions.totalHours / 60);

const completedTodayHours =
    Math.floor(dashboard.todayGoal.completedToday / 60);


    // weekly study bar chart --
     const allDays = [
  { dayNumber: 1, day: "Sun", hours: 0 },
  { dayNumber: 2, day: "Mon", hours: 0 },
  { dayNumber: 3, day: "Tue", hours: 0 },
  { dayNumber: 4, day: "Wed", hours: 0 },
  { dayNumber: 5, day: "Thu", hours: 0 },
  { dayNumber: 6, day: "Fri", hours: 0 },
  { dayNumber: 7, day: "Sat", hours: 0 },
];
    
     const formattedWeeklyData = allDays.map( (day) =>{
      const foundDay = dashboard.weeklyStudy.find(
        (study) => study.day === day.dayNumber
      );

      return {
        day:day.day,
        hours:foundDay ? foundDay.hours / 60 : 0
      };
     });
   
// ----- subject pie chart 

     const formattedSubjectData = dashboard.subjectData.map((item) => ({
      subject:item.subject,
      hours:item.hours / 60,
     }));

    //  console.log(formattedSubjectData);


     if (loading) {
    return (
        <div className="loading-state">
            Loading Dashboard...
        </div>
    );
}

  return (
<div className="dashboard-container">
    <div className="stats-container">
    <StatsCard
      title="Total Sessions"
      value={dashboard.sessions.totalSessions}
      icon={<FaBook />}
    />
    <StatsCard
    title="Study Hours"
    value={`${totalStudyHours} Hours`}
    icon={<FaClock />}
    
/>

<StatsCard
    title="Completed"
    value={dashboard.sessions.completedSessions}
    icon={<FaCheckCircle />}
    
/>

<StatsCard
    title="Pending"
    value={dashboard.sessions.pendingSessions}
    icon={<FaClipboardList />}
/>

</div>

<div className="charts-container">

  <div className="study-chart">
  <WeeklyStudyChart 
weeklyData={formattedWeeklyData}/>
  </div>
  
  <div className="subject-chart"> 
<SubjectPieChart 
subjectData={formattedSubjectData}
/>
  </div>


</div>

<div className="foot-container">

  <div className="sessions-section">
  <RecentSessions
  recentSessions={dashboard.recentSessions}
  />
  </div>

  <div className="goal-section">
  <TodayGoalCard
goalHours={dashboard.goalHours}
completedHours={completedTodayHours}
currentStreak={dashboard.streak}
/>
  </div>



</div>



</div>

  );
}

export default Dashboard;
