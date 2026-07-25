import "./EditProfilePageModal.css";

function EditProfileModal({
    isOpen,
    formData,
    setFormData,
    onClose,
    onSave,
    saving
}) {

    if (!isOpen) return null;

    return (
    <div className="modal-overlay">
        <div className="modal">

            {/* <h2>Edit Profile</h2> */}
            <p className="modal-subtitle">
                Update your account information.
            </p>

            <div className="form-group">
                <label>Name</label>

                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                    }
                />
            </div>

            <div className="form-group">
                <label>Daily Goal (Hours)</label>

                <input
                    type="number"
                    value={formData.dailyGoal}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            dailyGoal: Number(e.target.value),
                        })
                    }
                />
            </div>

            <div className="modal-form-buttons">

                <button
                    className="save-btn"
                    onClick={onSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save"}
                </button>

                <button
                    className="cancel-btn"
                    onClick={onClose}
                    disabled={saving}
                >
                    Cancel
                </button>

            </div>

        </div>
    </div>
);

}

export default EditProfileModal;