import "./StatisticsCard.css";

function StatisticsCard({ title, value, icon, color }) {
  return (
    <div className="statistics-card"
    style={{
      color:color,
      backgroundColor:`${color}18`
    }}
    >

      <div
        className="statistics-icon"
        style={{ color: color }}
      >
        {icon}
      </div>

      <div className="statistics-content">
        <p className="statistics-title">
          {title}
        </p>

        <h2 className="statistics-value">
          {value}
        </h2>
      </div>

    </div>
  );
}

export default StatisticsCard;