import "./TodayGoalCard.css";

function TodayGoalCard({ goalHours, completedHours , currentStreak }) {
  const progress = (completedHours / goalHours) * 100;
  const remainingHours = (goalHours / completedHours);

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
          style={ {width: `${progress}%`}}
          ></div>
        </div>

        <p className="goal-progress">
            {Math.round(progress)}% Completed
        </p>

        <p>
          {completedHours} / {goalHours} Hours
        </p>

        
      </div>

        <div className="goal-stats">
            <div className="goal-stat1">
                <h4>Current Streak</h4>
                <p>{currentStreak}</p>
            </div>

            <div className="goal-stat2">
                <h4>Remaining</h4>
                <p>{Math.floor(remainingHours)} Hours</p>
            </div>
        </div>

    </section>
  );
}

export default TodayGoalCard;
