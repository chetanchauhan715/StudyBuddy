import "./RecentUserCard.css";

function RecentUserCard({user}){

    const avatar = user.name.charAt(0).toUpperCase();
    const date = new Date(user.createdAt).toLocaleDateString(
        "en-IN",{
             day:"numeric",
            month:"short"
        }
       
    );


    return(

        <div className="user-card">

    <div className="user-left">

        <span className="user-avatar">
            {avatar}
        </span>

        <div className="user-info">

            <h3>{user.name}</h3>

            <p>{user.email}</p>

        </div>

    </div>

    <span className="user-date">
        {date}
    </span>

</div>
        
    );
    
}

export default RecentUserCard;