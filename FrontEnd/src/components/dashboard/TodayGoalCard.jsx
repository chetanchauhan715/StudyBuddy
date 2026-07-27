import { FaFire, FaClock } from "react-icons/fa";
import "./TodayGoalCard.css";

function TodayGoalCard({ goalHours, completedHours, currentStreak }) {

    const progress = Math.min((completedHours / goalHours) * 100, 100);

    const remainingHours = Math.max(goalHours - completedHours, 0);

    return (
        <section className="today-goal">

            <h3>Today's Goal</h3>

            <div className="goal-content">

                <p className="goal-text">
                    Study {goalHours} Hours
                </p>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <p className="goal-progress">
                    {Math.round(progress)}% Completed
                </p>

                <p className="goal-hours">
                    {completedHours} / {goalHours} Hours
                </p>

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