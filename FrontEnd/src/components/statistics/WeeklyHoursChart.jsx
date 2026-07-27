import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

import "./WeeklyHoursChart.css";


function WeeklyHoursChart({data}){

    if (!data || data.length === 0) {
    return (
        <section className="weekly-chart-card">

            <div className="chart-header">
                <h2>Weekly Study Hours</h2>
                <p>Your study hours across the week</p>
            </div>

            <div className="empty-state">

                <h3>No Weekly Data 📈</h3>

                <p>
                    Complete study sessions to see your weekly progress.
                </p>

            </div>

        </section>
    );
}
    return (
       <section className="weekly-chart-card">

        <div className="chart-header">
        <h2>Weekly Study Hours</h2>
        <p>Your study hours across the week</p>
        </div>

        <div className="chart-container"> 
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
    data={data}
    margin={{
        top:5,
        right:20,
        left:-20,
        bottom:5,
    }}
>
                <CartesianGrid 
                 strokeDasharray="3 3"
                vertical={false}
                /> 
                <XAxis  dataKey={"day"}/>
                <YAxis  />
                <Tooltip/>
               <Line
                type="monotone"
                dataKey="hours"
                stroke="#5B4CF0"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}

              />

            </LineChart>
        </ResponsiveContainer>

        </div>
       </section>
    )
}

export default WeeklyHoursChart;