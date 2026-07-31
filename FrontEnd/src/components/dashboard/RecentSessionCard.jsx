import "./RecentSessionCard.css";

function RecentSessionCard({ session }) {

    const studyHours = (session.duration / 60).toFixed(1);

    const formattedDate = new Date(session.studyDate).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short"
        }
    );

    return (

        <article className="session-card">

            <div className="session-header">

                <div>
                    <h3>{session.subject.name}</h3>
                    <small>{formattedDate}</small>
                </div>

                <span
                    className={
                        session.status === "Completed"
                            ? "completed"
                            : "pending"
                    }
                >
                    {session.status}
                </span>

            </div>

            <p>
                {session.topic || "No topic added"}
            </p>

            <div className="session-footer">

                <span>⏱ {studyHours} hrs</span>

            </div>

        </article>

    );
}

export default RecentSessionCard;