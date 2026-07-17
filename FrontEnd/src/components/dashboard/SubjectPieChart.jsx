import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";


function SubjectPieChart({subjectData}){

    const COLORS = ["#5B4BDB", "#3B82F6", "#10B981", "#F59E0B"];

    return(
        <section className="subject-piechart">
            <h3>Subject Distribution</h3>

            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>

                    <PieChart>

                        <Pie
                        data={subjectData}
                        dataKey="hours"
                        nameKey="subject"
                        outerRadius={120}
                        >
                            {subjectData.map( (entry , index) => (
                                <Cell  key={entry.subject}
                                fill={COLORS[index % COLORS.length]}
                                />
                            ))}

                        </Pie>
                        <Tooltip/>
                        <Legend
                        // layout="vertical"
                        // verticalAlign="middle"
                        // align="right"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </section>
    )
}

export default SubjectPieChart;