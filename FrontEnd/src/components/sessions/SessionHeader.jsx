import "./SessionHeader.css";

function SessionHeader(){
    return(
        <section className="header-container">
            <div className="header-left">
                <h1>All Study Sessions</h1>
                <p>Manage and track your study sessions</p>
            </div>

            <div className="header-right">
                <button>
                     + Add Session 
                </button>
            </div>
        </section>
    )
}

export default SessionHeader;