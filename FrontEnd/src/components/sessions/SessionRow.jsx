import "./SessionTable.css";

function SessionRow({ session, onEdit, onDelete }) {
  return (
    <tr>
      <td>{session.subject}</td>

      <td>{session.topic}</td>

      <td>{Math.ceil(session.duration / 60)} hrs</td>

      <td>{session.status}</td>

      <td>
        {new Date(session.studyDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>

      <td className="action-cell">
        <button
          className="edit-btn"
          onClick={() => onEdit(session)}
        >
          ✏ Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(session._id)}
        >
          🗑 Delete
        </button>
      </td>
    </tr>
  );
}

export default SessionRow;