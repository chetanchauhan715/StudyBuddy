import "./SessionHeader.css";
import { FaPlus } from "react-icons/fa";

function SessionHeader({ onAddSession }) {

    return (

        <section className="session-header-container">

            <div className="session-header-left">

                <h2>Study Sessions</h2>

                <p>
                    Manage, organize and track all your study sessions.
                </p>

            </div>

            <button
                className="primary-btn add-session-btn"
                onClick={onAddSession}
            >
                <FaPlus />
                <span>Add Session</span>
            </button>

        </section>

    );

}

export default SessionHeader;