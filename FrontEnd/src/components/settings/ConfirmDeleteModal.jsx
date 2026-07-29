import "./ConfirmDeleteModal.css";

function ConfirmDeleteModal({ onClose, onDelete }) {
  return (
    <section className="modal-overlay" onClick={onClose}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>

        <h2>Delete Subject?</h2>

        <p>
          Are you sure you want to delete this subject?
        </p>

        <p className="warning-text">
          This action cannot be undone.
        </p>

        <div className="modal-buttons">

          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={onDelete}
          >
            Delete
          </button>

        </div>

      </div>
    </section>
  );
}

export default ConfirmDeleteModal;