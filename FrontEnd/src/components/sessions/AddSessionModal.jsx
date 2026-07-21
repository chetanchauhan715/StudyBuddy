import { useState, useEffect } from "react";
import "./AddSessionModal.css";

function AddSessionModal({ onClose, onSave, editingSession , onUpdate}) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("Pending");
  const [studyDate, setStudyDate] = useState("");

  const [error , setError] = useState("");

  useEffect(() => {
    if (editingSession !== null) {
      setSubject(editingSession.subject);
      setTopic(editingSession.topic);
      setDuration(editingSession.duration / 60);
      setStatus(editingSession.status);
      setStudyDate(editingSession.studyDate?.split("T")[0]);
    } else {
      setSubject("");
      setTopic("");
      setDuration("");
      setStatus("Pending");
      setStudyDate("");
    }
  }, [editingSession]);

async  function handleSubmit(e) {
    e.preventDefault();

    if (!subject || !duration || !studyDate) {
      alert("Please fill all the required fields");
      return;
    }

    try{
      setError("");
    if(editingSession){
      const updatedSession = {
        id:editingSession._id,
        subject,
        topic,
        duration: Number(duration) * 60 ,
        status,
        studyDate,
      };

    await onUpdate(updatedSession);
      onClose();
    }  
      else {
      const newSession = {
        id: Date.now(),
        subject,
        topic,
        duration: Number(duration) * 60,
        status,
        studyDate,
      };
  
      await onSave(newSession);
      onClose();
    }

  } catch (error){
    setError(error.response.data.error[0].msg);
  }
    
  }  





  return (
    <section className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>
          {editingSession ? "Edit Session" : "Add new Session"}
        </h2>

        {error && <p className="error-message">{error}</p>}

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
              value={studyDate}
              onChange={(e) => setStudyDate(e.target.value)}
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
