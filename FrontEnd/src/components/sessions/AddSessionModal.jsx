import { useState, useEffect } from "react";
import "./AddSessionModal.css";

function AddSessionModal({ onClose, onSave, editingSession , onUpdate}) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("Pending");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingSession !== null) {
      setSubject(editingSession.subject);
      setTopic(editingSession.topic);
      setDuration(editingSession.duration);
      setStatus(editingSession.status);
      setDate(editingSession.date);
    } else {
      setSubject("");
      setTopic("");
      setDuration("");
      setStatus("Pending");
      setDate("");
    }
  }, [editingSession]);


  function handleSubmit(e) {
    e.preventDefault();

    if (!subject || !duration || !date) {
      alert("Please fill all the required fields");
      return;
    }

    if(editingSession){
      const updatedSession = {
        id:editingSession.id,
        subject,
        topic,
        duration,
        status,
        date,
      };

      onUpdate(updatedSession);
      onClose();
    }  
      else {
      const newSession = {
        id: Date.now(),
        subject,
        topic,
        duration,
        status,
        date,
      };
  
      onSave(newSession);
      onClose();
    }
    
  }



  return (
    <section className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>
          {editingSession ? "Edit Session" : "Add new Session"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject</label>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Select Subject</option>
              <option>React</option>
              <option>DSA</option>
              <option>Node.js</option>
              <option>JavaScript</option>
            </select>
          </div>

          <div className="form-group">
            <label>Topic</label>

            <input
              type="text"
              placeholder="Enter topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Duration (Hours)</label>

            <input
              type="number"
              placeholder="2"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit">
              {editingSession ? "Update Session" : "Add Session"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddSessionModal;
