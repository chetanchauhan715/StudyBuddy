import StatisticsCard from "./StatisticsCard";
import "./StatisticsCards.css";
import {
  FaBook,
  FaCheckCircle,
  FaClock,
  FaHourglassHalf,
  FaChartLine,
  FaFire,
  FaStopwatch,
  FaStar,
} from "react-icons/fa";


function StatisticsCards({statistics}){

   const statisticsCards = [
  {
    title: "Total Sessions",
    value: statistics.totalSessions,
    icon: <FaBook />,
    color: "#3B82F6",
  },
  {
    title: "Completed",
    value: statistics.completedSessions,
    icon: <FaCheckCircle />,
    color: "#22C55E",
  },
  {
    title: "Pending",
    value: statistics.pendingSessions,
    icon: <FaHourglassHalf />,
    color: "#F59E0B",
  },
  {
    title: "Total Hours",
    value: `${(statistics.totalHours / 60)} hrs`,
    icon: <FaClock />,
    color: "#7C3AED",
  },
  {
    title: "Completion Rate",
    value: `${statistics.completionRate}%`,
    icon: <FaChartLine />,
    color: "#06B6D4",
  },
  {
    title: "Current Streak",
    value: `${statistics.currentStreak} Days`,
    icon: <FaFire />,
    color: "#EF4444",
  },
  {
    title: "Avg Session",
    value: `${statistics.averageSessionDuration/ 60} hrs`,
    icon: <FaStopwatch />,
    color: "#0EA5E9",
  },
  {
    title: "Favorite Subject",
    value: statistics.favoriteSubject || "N/A",
    icon: <FaStar />,
    color: "#FACC15",
  },
];

    return (
        <div className="statistics-grid">
            {statisticsCards.map( (card) => (
                <StatisticsCard 
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                />
            ))}
        </div>
    ) 
}

export default StatisticsCards;