import "./WeeklyReportCard.css";

function WeeklyReportCard({ report }) {

    if (!report) {
        return null;
    }

    const totalHours =
        report.totalMinutes / 60;

    const focusHours =
        report.weeklyFocus?.totalMinutes
            ? report.weeklyFocus.totalMinutes / 60
            : 0;

    const bestDayHours =
        report.bestDay?.totalMinutes
            ? report.bestDay.totalMinutes / 60
            : 0;

    const lastWeekHours =
        report.lastWeekMinutes / 60;


    const bestDayLabel =
        report.bestDay?.date
            ? new Date(report.bestDay.date)
                .toLocaleDateString("en-US", {
                    weekday: "long"
                })
            : "No data";


    const weeklyChangeText =
        report.weeklyChange > 0
            ? `+${report.weeklyChange}%`
            : `${report.weeklyChange}%`;


    const insightText = (() => {

        if (report.totalMinutes === 0) {
            return "No completed study sessions recorded this week.";
        }

        if (report.weeklyChange > 0) {
            return `You studied ${report.weeklyChange}% more than last week and stayed active on ${report.activeDays} days.`;
        }

        if (report.weeklyChange < 0) {
            return `You studied ${Math.abs(report.weeklyChange)}% less than last week and stayed active on ${report.activeDays} days.`;
        }

        return `Your study time matched last week, with activity across ${report.activeDays} days.`;
    })();


    return (
        <section className="weekly-report-card">

            <div className="weekly-report-header">

                <div>
                    <span className="weekly-report-badge">
                        ✨ Premium Report
                    </span>

                    <h3>
                        Weekly Study Report
                    </h3>

                    <p>
                        A quick summary of how your study week is going.
                    </p>
                </div>

            </div>


            <div className="weekly-report-summary-grid">

                <div className="weekly-report-stat">
                    <span>Study Time</span>
                    <strong>
                        {totalHours.toFixed(1)} hrs
                    </strong>
                </div>

                <div className="weekly-report-stat">
                    <span>Completed Sessions</span>
                    <strong>
                        {report.completedSessions}
                    </strong>
                </div>

                <div className="weekly-report-stat">
                    <span>Active Days</span>
                    <strong>
                        {report.activeDays} / 7
                    </strong>
                </div>

                <div className="weekly-report-stat">
                    <span>Weekly Change</span>
                    <strong
                        className={
                            report.weeklyChange > 0
                                ? "positive"
                                : report.weeklyChange < 0
                                ? "negative"
                                : ""
                        }
                    >
                        {weeklyChangeText}
                    </strong>
                </div>

            </div>


            <div className="weekly-report-goal">

                <div className="weekly-report-goal-top">

                    <div>
                        <span>
                            Weekly Goal
                        </span>

                        <strong>
                            {totalHours.toFixed(1)} / {report.weeklyGoal} hrs
                        </strong>
                    </div>

                    <strong>
                        {report.goalProgress}%
                    </strong>

                </div>


                <div className="weekly-report-progress-bar">

                    <div
                        className="weekly-report-progress-fill"
                        style={{
                            width: `${report.goalProgress}%`
                        }}
                    />

                </div>

            </div>


            <div className="weekly-report-details">

                <div className="weekly-report-detail">

                    <span>
                        Top Focus
                    </span>

                    <strong>
                        {report.weeklyFocus?.subject || "No data"}
                    </strong>

                    <p>
                        {focusHours.toFixed(1)} hrs this week
                    </p>

                </div>


                <div className="weekly-report-detail">

                    <span>
                        Best Day
                    </span>

                    <strong>
                        {bestDayLabel}
                    </strong>

                    <p>
                        {bestDayHours.toFixed(1)} hrs studied
                    </p>

                </div>


                <div className="weekly-report-detail">

                    <span>
                        Last Week
                    </span>

                    <strong>
                        {lastWeekHours.toFixed(1)} hrs
                    </strong>

                    <p>
                        Previous week's total
                    </p>

                </div>

            </div>


            <div className="weekly-report-insight">

                <span>
                    💡 Weekly Insight
                </span>

                <p>
                    {insightText}
                </p>

            </div>

        </section>
    );
}

export default WeeklyReportCard;
