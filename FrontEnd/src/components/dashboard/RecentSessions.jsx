import RecentSessionCard from "./RecentSessionCard";
import "./RecentSessions.css";

const recentSessions = [
    {
        id: 1,
        subject: "React",
        topic: "React Hooks",
        duration: "2h",
        date: "Today",
        status: "Completed",
    },
    {
        id: 2,
        subject: "DSA",
        topic: "Sliding Window",
        duration: "1.5h",
        date: "Yesterday",
        status: "Pending",
    },
    {
        id: 3,
        subject: "Node.js",
        topic: "JWT Authentication",
        duration: "3h",
        date: "2 days ago",
        status: "Completed",
    },
];


function RecentSessions(){
    return(
        <section className="recent-sessions">

            <h2>Recent Study Sessions</h2>

            <div className="recent-session-list">
            {recentSessions.map( (session) => (
                <RecentSessionCard 
                key={session.id}
                session={session} />
            ))}
            </div>
            


        </section>
    );
}

export default RecentSessions;