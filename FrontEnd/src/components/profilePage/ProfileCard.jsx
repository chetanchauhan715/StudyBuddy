import "./ProfileCard.css";

function ProfileCard({ profile }) {
    return (
        <section className="profile-card">

            <div className="profile-card-top">

                <div className="profile-avatar">
                    {profile.name.charAt(0).toUpperCase()}
                </div>

                <div className="profile-user-info">

                    <h2>{profile.name}</h2>

                    <p>{profile.email}</p>

                </div>

            </div>

            <hr />

           <div className="profile-info-grid">

    <div className="profile-info-card">

        <p className="info-title">
            Daily Goal
        </p>

        <h3 className="info-value">
            {profile.dailyGoal} Sessions 
        </h3>

    </div>

    <div className="profile-info-card">

        <p className="info-title">
            Joined
        </p>

        <h3 className="info-value">
            {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "—"}
        </h3>

    </div>

</div>

            <div className="profile-actions">

                <button className="edit-profile-btn">
                    Edit Profile
                </button>

            </div>

        </section>
    );
}

export default ProfileCard;