import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import "./WeeklyStudyChart.css";

function WeeklyStudyChart({ weeklyData }) {

    const hasStudyData = weeklyData?.some(
        (item) => item.hours > 0
    );

    if (!hasStudyData) {
        return (
            <section className="weekly-study-chart app-card">

                <div className="card-header">
                    <h3>Weekly Study Hours</h3>
                </div>

                <div className="empty-state">
                    <h3>No Weekly Data 📈</h3>

                    <p>
                        Complete your first study session to unlock weekly insights.
                    </p>
                </div>

            </section>
        );
    }

    return (
        <section className="weekly-study-chart app-card">

            <div className="card-header">
                <h3>Weekly Study Hours</h3>

                <span>This Week</span>
            </div>

            <div className="chart-container">

                <ResponsiveContainer width="100%" height={320}>

                    <BarChart data={weeklyData}>

                        <CartesianGrid
                            stroke="#E5E7EB"
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            cursor={{ fill: "rgba(91,75,219,.08)" }}
                        />

                        <Bar
                            dataKey="hours"
                            fill="#5B4BDB"
                            radius={[8, 8, 0, 0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </section>
    );
}

export default WeeklyStudyChart;