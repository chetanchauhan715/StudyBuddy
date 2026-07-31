import "./StatsCard.css";

function StatsCard({ title, value, icon, change }) {
  return (
    <div className="stats-card app-card">

      <div className="stats-top">
        <div className="stats-icon">
          {icon}
        </div>
      </div>

      <div className="stats-content">
        <h2>{value}</h2>
        <p>{title}</p>

        {change && (
          <small>{change}</small>
        )}
      </div>

    </div>
  );
}

export default StatsCard;