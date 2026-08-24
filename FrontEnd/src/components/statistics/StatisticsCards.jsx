import StatisticsCard from "./StatisticsCard";
import "./StatisticsCards.css";
import {
  BookOpen,
  CircleCheck,
  Clock,
  Hourglass,
  TrendingUp,
  Flame,
  Timer,
  Star,
} from "lucide-react";

function StatisticsCards({statistics}){

   const statisticsCards = [
  {
    title: "Total Sessions",
    value: statistics.totalSessions,
    icon: <BookOpen strokeWidth={2.5} />,
    color: "#3B82F6",
  },
  {
    title: "Completed",
    value: statistics.completedSessions,
    icon: <CircleCheck strokeWidth={2.5} />,
    color: "#22C55E",
  },
  {
    title: "Pending",
    value: statistics.pendingSessions,
    icon: <Clock strokeWidth={2.5} />,
    color: "#F59E0B",
  },
  {
    title: "Total Hours",
    value: `${(statistics.totalHours / 60).toFixed(1)} hrs`,
    icon: <Hourglass strokeWidth={2.5}/>,
    color: "#7C3AED",
  },
  {
    title: "Completion Rate",
    value: `${statistics.completionRate}%`,
    icon: <TrendingUp strokeWidth={2.5} />,
    color: "#06B6D4",
  },
  {
    title: "Current Streak",
    value: `${statistics.currentStreak} Days`,
    icon: <Flame strokeWidth={2.5}/>,
    color: "#EF4444",
  },
  {
    title: "Avg Session",
    value: `${(statistics.averageSessionDuration/ 60).toFixed(1)} hrs`,
    icon: <Timer strokeWidth={2.5} />,
    color: "#0EA5E9",
  },
  {
    title: "Favorite Subject",
    value: statistics.favoriteSubject || "N/A",
    icon: <Star strokeWidth={2.5} />,
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