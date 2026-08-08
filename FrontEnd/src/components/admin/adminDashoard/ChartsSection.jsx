import "./ChartsSection.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  Label

} from "recharts";

const COLORS = [
 "#10B981",   // Emerald
 "#EF4444",   // Red
];

function ChartsSection({ chartData, pieChartData, totalSessions }) {
  return (
    <section className="charts-section">

      <div className="line-chart-container">

        <h3>Weekly Study Activity</h3>
        <p className="chart-subtitle">Last 7 Days</p>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid
            strokeDasharray="3 3"
            />

            <XAxis dataKey="day" />

            <YAxis
            tickFormatter={ (value)=> `${Math.round(value / 60)}h`}
            />

            <Tooltip
            formatter={ (value)=> `${(value/60).toFixed(1)}hrs`}
            />

            <Line
              type="monotone"
              dataKey="totalTime"
              stroke="#6366F1"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 7,
                fill: "#6366F1",
                stroke: "#fff",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>


      <div className="pie-chart-container">

        <h3>Session Status</h3>

        <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie  
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={60}
              paddingAngle={5}
              >

              {pieChartData.map( (entry , index) =>(
                <Cell 
                key={entry.name}
                fill={COLORS[index]}
                />
              ))}

              </Pie>

              <Tooltip
              formatter={ (value)=> `${value} Sessions`}
              />

              <Legend
              verticalAlign="bottom"
              iconType="circle"
              height={36}
              />
                
            </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
export default ChartsSection;
