import StatisticsCard from "./StatisticsCard";
import "./StatisticsCards.css";
import {
  FaBook,
  FaCheckCircle,
  FaClock,
  FaHourglassHalf,
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
    value: `${statistics.totalHours/60} hrs`,
    icon: <FaClock />,
    color: "#7C3AED",
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