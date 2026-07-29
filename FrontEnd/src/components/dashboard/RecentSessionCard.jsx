import "./RecentSessionCard.css";

function RecentSessionCard({session}){
    console.log(session);

    const studyHours = session.duration / 60;

    const formattedDate = new Date(session.studyDate).toLocaleDateString(
        "en-IN",
        {
            day:"numeric",
            month:"short"
        }
    );
    return(
        <article className="session-card">

            <div className="session-header">
                <h3>{session.subject.name}</h3>
                <span className={
                    session.status === "Completed"?
                    "completed":
                    "pending"
                }>{session.status}</span>
            </div>

           <p>{session.topic || "No topic added"}</p>

            <div className="session-footer">
                <span>{formattedDate}</span>
                <span>{studyHours}Hours</span>
            </div>
        </article>
    )
}

export default RecentSessionCard;