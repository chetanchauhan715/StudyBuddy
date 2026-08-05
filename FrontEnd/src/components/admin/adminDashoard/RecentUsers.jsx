import RecentUserCard from "./RecentUserCard";
import "./RecentUsers.css";

function RecentUsers({ recentUsers }) {
  if (recentUsers.length === 0) {
    return <p>No Users Yet</p>;
  }

  return (
   <section className="recent-users-section">

    <div className="section-header">

        <h2>Recent Users</h2>

        <button className="view-all-btn">
            View All →
        </button>

    </div>

    <div className="recent-users-list">

        {recentUsers.map((user)=>(
            <RecentUserCard
                key={user._id}
                user={user}
            />
        ))}

    </div>

</section>
  );
}

export default RecentUsers;
