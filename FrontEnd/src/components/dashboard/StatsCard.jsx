import "./StatsCard.css";
function StatsCard ({title , value , icon , change}){
    return (
        <div className="stats-card app-card">
           
           <span className="stats-icon">
            {icon}
           </span>
           <h2>{value}</h2>
           <p>{title}</p>
           {change && (
            <small>{change}</small>
           )}
        </div>
       

       
    )
}

export default StatsCard;