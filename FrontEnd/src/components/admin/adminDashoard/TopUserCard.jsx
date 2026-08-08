import "./TopUserCard.css";
import "./RecentUserCard.css";

function TopUserCard({user}){
    const studyTime = (user.studyTime/ 60).toFixed(1) ;
    const avatar = user.name.charAt(0).toUpperCase();

    return (

        <div className="user-card">

            <div className="user-left">

                <span className="user-avatar">{avatar}</span>

                <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                </div>
            </div>
            <div className="user-right">
                {studyTime} hrs
            </div>
        </div>

        
    )
}

export default TopUserCard;