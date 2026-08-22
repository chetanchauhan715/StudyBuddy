import "./PremiumInsightCard.css";

function PremiumInsightCard({
  title,
  value,
  description,
  icon,
  trend
}) {
  return (
    <div className="premium-insight-card">

      <div className="premium-insight-header">

        <div className="premium-insight-icon">
          {icon}
        </div>

        <span className="premium-insight-label">
          Premium Insight
        </span>

      </div>

      <h4 className="premium-insight-title">
        {title}
      </h4>

      <div className="premium-insight-value">
        {value}
      </div>

      <p className="premium-insight-description">
        {description}
      </p>

      {trend && (
        <div className={`premium-insight-trend ${trend.type}`}>
          {trend.text}
        </div>
      )}

    </div>
  );
}

export default PremiumInsightCard;