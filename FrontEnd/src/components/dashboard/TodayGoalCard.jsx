import { FaFire, FaClock } from "react-icons/fa";
import "./TodayGoalCard.css";

function TodayGoalCard({ goalHours, completedHours, currentStreak }) {

    const progress =
        goalHours > 0
            ? Math.min((completedHours / goalHours) * 100, 100)
            : 0;

    const remainingHours = Math.max(goalHours - completedHours, 0);

    return (
        <section className="today-goal app-card">

            <div className="card-header">
                <h3>Today's Goal</h3>
                <span>Daily</span>
            </div>

            <div className="goal-content">

                <p className="goal-text">
                    Study <strong>{goalHours}</strong> Hours
                </p>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="goal-progress-row">

                    <span>{Math.round(progress)}% Completed</span>

                    <span>
                        {completedHours} / {goalHours} hrs
                    </span>

                </div>

            </div>

            <div className="goal-stats">

                <div className="goal-stat">

                    <div className="goal-icon streak">
                        <FaFire />
                    </div>

                    <h4>Current Streak</h4>

                    <p>{currentStreak} Days</p>

                </div>

                <div className="goal-stat">

                    <div className="goal-icon remaining">
                        <FaClock />
                    </div>

                    <h4>Remaining</h4>

                    <p>{remainingHours} hrs</p>

                </div>

            </div>

        </section>
    );
}

export default TodayGoalCard;