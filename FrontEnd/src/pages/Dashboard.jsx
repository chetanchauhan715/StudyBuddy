import StatsCard from "../components/dashboard/StatsCard";
import { FaBook , FaClock, FaCheckCircle, FaClipboardList } from "react-icons/fa";
import "./Dashboard.css";
import WeeklyStudyChart from "../components/dashboard/WeeklyStudyChart";
import SubjectPieChart from "../components/dashboard/SubjectPieChart";
import RecentSessions from "../components/dashboard/RecentSessions";
import TodayGoalCard from "../components/dashboard/TodayGoalCard";

function Dashboard() {
  const weeklyData = [
    { day: "Mon", hours: 2 },
    { day: "Tue", hours: 3 },
    { day: "Wed", hours: 5 },
    { day: "Thu", hours: 1 },
    { day: "Fri", hours: 2 },
    { day: "Sat", hours: 4 },
    { day: "Sun", hours: 3 },
  ];

  const subjectData = [
    {
        subject: "React",
        hours: 35
    },
    {
        subject: "DSA",
        hours: 25
    },
    {
        subject: "Node",
        hours: 20
    },
    {
        subject: "Other",
        hours: 20
    }
];

  return (
<div className="dashboard-container">
    <div className="stats-container">
    <StatsCard
      title="Total Sessions"
      value="48"
      icon={<FaBook />}
      change="+12%"
    />
    <StatsCard
    title="Study Hours"
    value="126h"
    icon={<FaClock />}
    change="+8%"
/>

<StatsCard
    title="Completed"
    value="39"
    icon={<FaCheckCircle />}
    change="+15%"
/>

<StatsCard
    title="Pending"
    value="9"
    icon={<FaClipboardList />}
    change="-5%"
/>

</div>

<div className="charts-container">

  <div className="study-chart">
  <WeeklyStudyChart 
weeklyData={weeklyData}/>
  </div>
  
  <div className="subject-chart"> 
<SubjectPieChart 
subjectData={subjectData}
/>
  </div>


</div>

<div className="foot-container">

  <div className="sessions-section">
  <RecentSessions/>
  </div>

  <div className="goal-section">
  <TodayGoalCard
goalHours={6}
completedHours={2.6}
currentStreak={12}
/>
  </div>



</div>



</div>

  );
}

export default Dashboard;
