import { useState } from "react";
import { getStatistics } from "../services/studySessionService";
import { useEffect } from "react";
import StatisticsCards from "../components/statistics/StatisticsCards";
import WeeklyHoursChart from "../components/statistics/WeeklyHoursChart";
import SubjectDisctributionChart from "../components/statistics/SubjectDistributionChart";
import "./Statistics.css";
import Loader from "../components/common/Loader";


function Statistics(){

    const [statistics , setStatistics] = useState({
        totalSessions:0,
        completedSessions:0,
        pendingSessions:0,
        totalHours:0,
        formattedWeeklyHours: [],
        formattedSubjectDistribution: []

    });

    const[loading , setLoading]=useState(true);


    useEffect( ()=>{
        async function StatisticsData() {
            const Data = await getStatistics()
            setStatistics(Data);
            setLoading(false);
        }

        StatisticsData();

       
    } , []);


    
if(loading){
    return <Loader/>
}

    return(

        <div className="statistics-page">
 <section className="statistics-header">
    <h1>Statistics</h1>
    <p>Check Your Study Progress</p>
  </section>

<StatisticsCards
statistics={statistics}
/>


<div className="statistics-charts">

<div className="left-chart">
<WeeklyHoursChart 
data={statistics.formattedWeeklyHours}
/>

</div>


<div className="right-chart">
<SubjectDisctributionChart 
data={statistics.formattedSubjectDistribution}
/>
</div>
 

</div>

        </div>
 
    )
}

export default Statistics;