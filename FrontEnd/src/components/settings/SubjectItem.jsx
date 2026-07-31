import "./SubjectItem.css";

function SubjectItem({ subject, onEdit, onDelete }) {
  return (
    <div className="subject-item">
      <span>{subject.name}</span>

      <div className="subject-actions">
        <button className="edit-btn" onClick={() => onEdit(subject)}>
          ✏ Edit
        </button>

        <button className="delete-btn" onClick={() => onDelete(subject)}>
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

export default SubjectItem;
