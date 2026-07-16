import StatsCard from "../components/dashboard/StatsCard";
import { FaBook , FaClock, FaCheckCircle, FaClipboardList } from "react-icons/fa";
import "./Dashboard.css";

function Dashboard() {
  return (

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

  );
}

export default Dashboard;
