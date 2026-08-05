import "./StatCard.css";

function StatCard({title , value , icon}){
    const Icon = icon;
    return(
        <div className="stat-card">
            <span className="stat-icon"><Icon size-={24}/></span>
            <p className="stat-title">{title}</p>
            <h2 className="stat-value">{value}</h2>

        </div>
    )
}

export default StatCard;