import "./SessionHeader.css";
import { FaPlus } from "react-icons/fa";

function SessionHeader({ onAddSession }) {
  return (
    <section className="header-container">

      <div className="header-left">
        <h1>All Study Sessions</h1>
        <p>Manage and track your study sessions</p>
      </div>

      <div className="header-right">
        <button className="add-session-btn" onClick={onAddSession}>
          <FaPlus />
          <span>Add Session</span>
        </button>
      </div>

    </section>
  );
}

export default SessionHeader;