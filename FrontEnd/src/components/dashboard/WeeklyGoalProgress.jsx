import "./WeeklyGoalProgress.css";


function WeeklyGoalProgress({
    weeklyGoal,
    completedMinutes
}) {

    const completedHours =
        completedMinutes / 60;


    const progress =
        weeklyGoal > 0
            ? Math.min(
                Math.round(
                    (completedHours / weeklyGoal) * 100
                ),
                100
            )
            : 0;


    const remainingHours =
        Math.max(
            weeklyGoal - completedHours,
            0
        );


    return (
        <section className="weekly-goal-progress-card">

            <div className="weekly-goal-progress-header">

                <div>

                    <h3>
                        Weekly Goal Progress
                    </h3>

                    <p>
                        Track your progress toward this week's study target.
                    </p>

                </div>


                <span className="weekly-goal-progress-percent">
                    {progress}%
                </span>

            </div>


            {weeklyGoal > 0 ? (

                <>

                    <div className="weekly-goal-progress-value">

                        {completedHours.toFixed(1)}

                        <span>
                            {" / "}
                            {weeklyGoal} hrs
                        </span>

                    </div>


                    <div className="weekly-goal-progress-bar">

                        <div
                            className="weekly-goal-progress-fill"
                            style={{
                                width: `${progress}%`
                            }}
                        />

                    </div>


                    <p className="weekly-goal-progress-remaining">

                        {remainingHours > 0
                            ? `${remainingHours.toFixed(1)} hrs remaining this week`
                            : "Weekly goal completed 🎉"
                        }

                    </p>

                </>

            ) : (

                <p className="weekly-goal-progress-empty">
                    Set your weekly goal from your Profile page.
                </p>

            )}

        </section>
    );
}


export default WeeklyGoalProgress;