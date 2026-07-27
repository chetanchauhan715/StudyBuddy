import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import "./WeeklyStudyChart.css";

function WeeklyStudyChart({weeklyData}){


    const hasStudyData = weeklyData?.some(
    (item) => item.hours > 0
);

if (!hasStudyData) {
    return (
        <section className="weekly-study-chart">

            <h3>Weekly Study Hours</h3>

            <div className="empty-state">
                <h3>No Weekly Data 📈</h3>

                <p>
                    Complete your first study session to unlock weekly insights.
                </p>
            </div>

        </section>
    );
}


    return(
        <section className="weekly-study-chart">
            <h3>Weekly Study Hours</h3>

            <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>

                <BarChart data={weeklyData}>

                    <CartesianGrid
                     stroke="#E5E7EB"
                     strokeDasharray="4 4"
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

                    <Tooltip/>

                    <Bar 
                    dataKey="hours"
                    fill="#5B4BDB"
    radius={[6,6,0,0]}
                    />

                </BarChart>
            </ResponsiveContainer>
            </div>
        </section>
    )

}

export default WeeklyStudyChart;