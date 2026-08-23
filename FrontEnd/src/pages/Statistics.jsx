import { useState } from "react";
import { getStatistics , getPremiumStatistics } from "../services/studySessionService";
import { useEffect } from "react";
import StatisticsCards from "../components/statistics/StatisticsCards";
import WeeklyHoursChart from "../components/statistics/WeeklyHoursChart";
import SubjectDisctributionChart from "../components/statistics/SubjectDistributionChart";
import "./Statistics.css";
import Loader from "../components/common/Loader";

import {useUser} from "../context/UserContext";

import PremiumGate from "../components/premium/PremiumGate"
import PremiumPoster from "../components/premium/PremiumPoster";
import PremiumInsightCard from "../components/dashboard/PremiunInsightCard";

import {
    FaCalendarDay,
    FaChartLine,
    FaFire
} from "react-icons/fa";


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


    const [premiumStatistics , setPremiumStatistics] = useState({
        mostProductiveDay:{
            day:null,
            totalMinutes:0
        },

        monthlyTrend:{
            currentMonthMinutes:0,
            previousMonthMinute:0,
            monthlyChange:0
        },

        consistencyRate:{
            activeDays:0,
            daysElapse:0,
            precentage:0
        }
    });

    const [isPremiumPosterOpen , setIsPremiumPosterOpen] = useState(false);

    const {user} = useUser();

    const now = new Date();

    const isPremium = 
        user?.subscription?.plan === "premium" &&
        user?.subscription?.startDate &&
        user?.subscription?.endDate &&
        new Date(user.subscription.startDate) <= now &&
        new Date(user.subscription.endDate) > now;


    useEffect( ()=>{
        async function StatisticsData() {
            const Data = await getStatistics()
            setStatistics(Data);
            setLoading(false);
        }

        StatisticsData();

       
    } , []);

    // --------


    useEffect( ()=> {

    async function fetchPremiumStatistics() {
        
        if(!isPremium){
            return;
        }

        try{

            const data = await getPremiumStatistics();

            setPremiumStatistics(data);
        } catch(error){
            console.error(
                "Failed to fetch premium statitstics", 
                error
            );
        }
    }

    fetchPremiumStatistics();

    }, [isPremium]);

// ---------

const productiveDayHours =
    premiumStatistics.mostProductiveDay.totalMinutes / 60;

const currentMonthHours =
    premiumStatistics.monthlyTrend.currentMonthMinutes / 60;

const previousMonthHours =
    premiumStatistics.monthlyTrend.previousMonthMinutes / 60;

const monthlyChange =
    premiumStatistics.monthlyTrend.monthlyChange;


    // -------------------
    
if(loading){
    return <Loader/>
}

    return(

        <div className="statistics-page page-container">
 <section className="statistics-header">
    <h1>Statistics</h1>
    <p>Check Your Study Progress</p>
  </section>

<StatisticsCards
statistics={statistics}
/>


<section className="premium-statistics-section">

    <div className="premium-insights-header">

        <h3>Premium Analytics</h3>

        <span>
            ✨ Premium
        </span>

    </div>


    <div className="premium-statistics-grid">

        <PremiumGate
            isPremium={isPremium}
            onUpgrade={() =>
                setIsPremiumPosterOpen(true)
            }
        >

            <PremiumInsightCard
                title="Most Productive Day"

                value={
                    premiumStatistics
                        .mostProductiveDay
                        .day || "No data"
                }

                description={
                    `${productiveDayHours.toFixed(1)} hrs studied on this weekday this month`
                }

                icon={<FaCalendarDay />}
            />

        </PremiumGate>


        <PremiumGate
            isPremium={isPremium}
            onUpgrade={() =>
                setIsPremiumPosterOpen(true)
            }
        >

            <PremiumInsightCard
                title="Monthly Study Trend"

                value={
                    monthlyChange > 0
                        ? `+${monthlyChange}%`
                        : `${monthlyChange}%`
                }

                description={
                    `${currentMonthHours.toFixed(1)} hrs this month · ${previousMonthHours.toFixed(1)} hrs last month`
                }

                icon={<FaChartLine />}

                trend={{
                    type:
                        monthlyChange > 0
                            ? "positive"
                            : monthlyChange < 0
                            ? "negative"
                            : "neutral",

                    text:
                        monthlyChange > 0
                            ? "Study time increased"
                            : monthlyChange < 0
                            ? "Study time decreased"
                            : "No change from last month"
                }}
            />

        </PremiumGate>


        <PremiumGate
            isPremium={isPremium}
            onUpgrade={() =>
                setIsPremiumPosterOpen(true)
            }
        >

            <PremiumInsightCard
                title="Consistency Rate"

                value={
                    `${premiumStatistics
                        .consistencyRate
                        .percentage}%`
                }

                description={
                    `Studied on ${premiumStatistics.consistencyRate.activeDays} of ${premiumStatistics.consistencyRate.daysElapsed} days this month`
                }

                icon={<FaFire />}
            />

        </PremiumGate>

    </div>

</section>

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

<PremiumPoster
    isOpen={isPremiumPosterOpen}
    onClose={() =>
        setIsPremiumPosterOpen(false)
    }
/>

        </div>
 
    )
}

export default Statistics;