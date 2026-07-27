import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

import "./SubjectDistributionChart.css";
const COLORS = [
  "#6366F1", // Indigo
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EC4899", // Pink
];

function SubjectDisctributionChart({ data }) {
  return (
    <section className="subject-chart-card">
      <div className="chart-header">
        <h2>Subject study Hours </h2>
        <p>Your study hours across subject</p>
      </div>

      <div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              nameKey="subject"
              dataKey="hours"
              cx="48%"
              cy="45%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.subject}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              cursor={{
                stroke: "#E5E7EB",
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                paddingTop: 20,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default SubjectDisctributionChart;
