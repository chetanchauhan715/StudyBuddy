import "./TopUsers.css";
import TopUserCard from "./TopUserCard";

function TopUsers({ topUsersData }) {
  if (!topUsersData ||  topUsersData.length === 0) {
    return <p>No Top Users Found</p>;
  }

  return (
   <section className="top-users-section">

    <div className="section-header">

        <h2>Top Learners</h2>
{/* 
        <button className="view-all-btn">
            View All →
        </button> */}

    </div>

    <div className="top-users-list">

        {topUsersData.map((user)=>(
            <TopUserCard
                key={user._id}
                user={user}
            />
        ))}

    </div>

</section>
  );
}

export default TopUsers ;
