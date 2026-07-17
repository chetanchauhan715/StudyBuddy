import "./RecentSessionCard.css";

function RecentSessionCard({session}){
    return(
        <article className="session-card">

            <div className="session-header">
                <h3>{session.subject}</h3>
                <span className={
                    session.status === "Completed"?
                    "completed":
                    "pending"
                }>{session.status}</span>
            </div>

            <p>{session.topic}</p>

            <div className="session-footer">
                <span>{session.date}</span>
                <span>{session.duration}</span>
            </div>
        </article>
    )
}

export default RecentSessionCard;