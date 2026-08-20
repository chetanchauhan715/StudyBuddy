import { useState, useEffect } from "react";
import { createReminder, getTodayReminders , deleteReminder } from "../../services/reminderService";

import "./ReminderManager.css";


function ReminderManager() {

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [reminders , setReminders] = useState([]);


    async function handleSubmit(e) {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            setLoading(true);

            const scheduledDate = new Date(`${date}T${time}`);

            if(scheduledDate <= new Date()){
                setError("Reminder time must be in the future");

                return;
            }

            const scheduledAt =
                new Date(`${date}T${time}`).toISOString();

            await createReminder({
                title,
                scheduledAt
            });

            await fetchReminders();

            setMessage(
                "Reminder created successfully."
            );

            setTitle("");
            setDate("");
            setTime("");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to create reminder."
            );

        } finally {

            setLoading(false);
        }
    }
// -----------------

    async function fetchReminders() {

        try{
        const reminderData = await getTodayReminders();

        setReminders(reminderData.todayReminders);
        

        } catch(error){
            console.error(error);
        }
    }

    // ------------
    async function handleDelete(reminderId) {
        try{
            await deleteReminder(reminderId);
            await fetchReminders();
        } catch(error){
            console.error(error);
        }
    }

// ---------------
    useEffect( ()=>{
        fetchReminders();
    },[]);

    return (

        <div className="reminder-manager">

            <div className="reminder-manager-header">

                <h2>Reminders</h2>

                <p>
                    Schedule reminders for your study tasks.
                </p>

            </div>


            <div className="reminder-manager-body">

                <div className="reminder-plan-info">

                    <span className="reminder-plan-icon">
                        🔔
                    </span>

                    <div>
                        <strong>Study reminders</strong>

                        <p>
                            Free users get 1 reminder per day.
                            Premium users get unlimited reminders.
                        </p>
                    </div>

                </div>


                <form
                    className="reminder-form"
                    onSubmit={handleSubmit}
                >

                    <div className="reminder-field">

                        <label htmlFor="reminder-title">
                            Reminder title
                        </label>

                        <input
                            id="reminder-title"
                            className="app-input"
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="e.g. Revise DSA"
                            required
                        />

                    </div>


                    <div className="reminder-date-time">

                        <div className="reminder-field">

                            <label htmlFor="reminder-date">
                                Date
                            </label>

                            <input
                                id="reminder-date"
                                className="app-input"
                                type="date"
                                value={date}
                                min={ new Date().toISOString().split("T")[0]}
                                onChange={(e) =>
                                    setDate(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="reminder-field">

                            <label htmlFor="reminder-time">
                                Time
                            </label>

                            <input
                                id="reminder-time"
                                className="app-input"
                                type="time"
                                value={time}
                                onChange={(e) =>
                                    setTime(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>


                    {message && (
                        <div className="reminder-feedback success">
                            {message}
                        </div>
                    )}


                    {error && (
                        <div className="reminder-feedback error">
                            {error}
                        </div>
                    )}


                    <button
                        className="primary-btn reminder-submit-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Reminder"
                        }
                    </button>

                </form>

            </div>



            <div className="today-reminders">

    <h3>Today's Reminders</h3>

    {reminders.length === 0 ? (

        <p className="reminder-empty">
            No reminders scheduled for today.
        </p>

    ) : (

        <div className="reminder-list">

            {reminders.map((reminder) => (

                <div
                    className="reminder-item"
                    key={reminder._id}
                >

                    <div>
                        <h4>{reminder.title}</h4>

                        <span>
                            {new Date(
                                reminder.scheduledAt
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </span>
                    </div>


                    <div className="reminder-item-actions">

                        <span
                            className={`reminder-status ${reminder.status}`}
                        >
                            {reminder.status}
                        </span>


                        {reminder.status === "pending" && (

                            <button
                                type="button"
                                onClick={() =>
                                    handleDelete(reminder._id)
                                }
                            >
                                Delete
                            </button>

                        )}

                    </div>

                </div>

            ))}

        </div>

    )}

</div>

        </div>
    );
}


export default ReminderManager;