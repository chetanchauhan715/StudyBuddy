import { useState } from "react";
import { getStatistics } from "../services/studySessionService";
import { useEffect } from "react";
import StatisticsCards from "../components/statistics/StatisticsCards";

function Statistics(){

    const [statistics , setStatistics] = useState({
        totalSessions:0,
        completedSessions:0,
        pendingSessions:0,
        totalHours:0

    });


    useEffect( ()=>{
        async function StatisticsData() {
            const Data = await getStatistics()
            setStatistics(Data);
        }

        StatisticsData();

       
    } , []);


    return(

        <div>
 <section>
    <h1>Statistics</h1>
    <p>Check Your Study Progress</p>
  </section>

<StatisticsCards
statistics={statistics}
/>
        </div>
 
    )
}

export default Statistics;