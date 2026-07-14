function FeatureCard( {icon , title, description }){
    return (
        <div className="feature-card">
            <span>{icon}</span>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    )
}

export default FeatureCard;