import RecentSessionCard from "./RecentSessionCard";
import "./RecentSessions.css";

function RecentSessions({ recentSessions }) {

  if (recentSessions.length === 0) {
    return (
      <section className="recent-sessions app-card">

        <div className="card-header">
          <h2>Recent Study Sessions</h2>
          <span>Latest</span>
        </div>

        <div className="empty-state">

          <h3>No Study Sessions Yet 📚</h3>

          <p>
            Start your first study session to see it here.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="recent-sessions app-card">

      <div className="card-header">
        <h2>Recent Study Sessions</h2>
        <span>Latest</span>
      </div>

      <div className="recent-session-list">
        {recentSessions.map((session) => (
          <RecentSessionCard
            key={session._id}
            session={session}
          />
        ))}
      </div>

    </section>
  );
}

export default RecentSessions;