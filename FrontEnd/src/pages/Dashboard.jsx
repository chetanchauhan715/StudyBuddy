import StatsCard from "../components/dashboard/StatsCard";
import {
  FaBook,
  FaClock,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";
import "./Dashboard.css";
import WeeklyStudyChart from "../components/dashboard/WeeklyStudyChart";
import SubjectPieChart from "../components/dashboard/SubjectPieChart";
import RecentSessions from "../components/dashboard/RecentSessions";
import TodayGoalCard from "../components/dashboard/TodayGoalCard";

import Loader from "../components/common/Loader";

import { getDashboard , getPremiumDashboardInsights} from "../services/dashboardService";

import { useState, useEffect } from "react";
import UpgradeButton from "../components/payment/UpgradeButton";


import { useUser } from "../context/UserContext";
import PremiumGate from "../components/premium/PremiumGate";
import PremiumPoster from "../components/premium/PremiumPoster";
import PremiumInsightCard from "../components/dashboard/PremiunInsightCard";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    sessions: {
      totalSessions: 0,
      totalHours: 0,
      completedSessions: 0,
      pendingSessions: 0,
    },
    user: {
      name: "",
    },
    recentSessions: [],
    weeklyStudy: [],
    subjectData: [],
    todayGoal: {
      completedToday: 0,
    },
    goalHours: 0,
    streak: 0,
  });

  const [loading, setLoading] = useState(true);

  const [isPremiumPosterOpen , setIsPremiumPosterOpen] = useState(false);

  const [premiumInsights , setPremiumInsights] = useState({
    weeklyFocus:{
      subject:null,
      hours:0
    },

    weeklyPerformance:{
      thisWeekHours:0,
      lastWeekHours:0,
      weeklyChange:0
    }
  });


  
// --------------------

  const { user } = useUser();

const now = new Date();

const isPremium =
    user?.subscription?.plan === "premium" &&
    user?.subscription?.startDate &&
    user?.subscription?.endDate &&
    new Date(user.subscription.startDate) <= now &&
    new Date(user.subscription.endDate) > now;


  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await getDashboard();
        setDashboard(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);


  // ----------------

  useEffect( ()=>{
    async function fetchPremiunInsights() {
      
      if(!isPremium){
        return;
      }

    try{
      const data= await getPremiumDashboardInsights();

      setPremiumInsights(data);
    } catch(error){
      console.error(
        "Failed to fetched premium dashboard insights",
        error
      );
    }

  }
    fetchPremiunInsights();
  }, [isPremium]);



  const weeklyFocusHours =
  premiumInsights.weeklyFocus.hours / 60;

const thisWeekHours =
  premiumInsights.weeklyPerformance.thisWeekHours / 60;

const lastWeekHours =
  premiumInsights.weeklyPerformance.lastWeekHours / 60;

const weeklyChange =
  premiumInsights.weeklyPerformance.weeklyChange;


  // .---------

  const firstName = dashboard.user?.name?.split(" ")[0] || "";
 
  const totalStudyHours = Math.floor(dashboard.sessions.totalHours / 60);

  const completedTodayHours = Math.floor(
    dashboard.todayGoal.completedToday / 60,
  );

  // weekly study bar chart --
  const allDays = [
    { dayNumber: 1, day: "Sun", hours: 0 },
    { dayNumber: 2, day: "Mon", hours: 0 },
    { dayNumber: 3, day: "Tue", hours: 0 },
    { dayNumber: 4, day: "Wed", hours: 0 },
    { dayNumber: 5, day: "Thu", hours: 0 },
    { dayNumber: 6, day: "Fri", hours: 0 },
    { dayNumber: 7, day: "Sat", hours: 0 },
  ];

  const formattedWeeklyData = allDays.map((day) => {
    const foundDay = dashboard.weeklyStudy.find(
      (study) => study.day === day.dayNumber,
    );

    return {
      day: day.day,
      hours: foundDay ? foundDay.hours / 60 : 0,
    };
  });

  // ----- subject pie chart

  const formattedSubjectData = dashboard.subjectData.map((item) => ({
    subject: item.subject,
    hours: item.hours / 60,
  }));

  const currentHour = new Date().getHours();

  let greeting = "Welcome back";

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container page-container">
      <div className="dashboard-welcome">
        <h2>
          {greeting}, {firstName} 👋
        </h2>

        <p>Here's a quick overview of your learning progress today.</p>

        <UpgradeButton  
        plan="monthly"
        />
      </div>

      <div className="stats-container">


        <StatsCard
          title="Total Sessions"
          value={dashboard.sessions.totalSessions}
          icon={<FaBook />}
        />
       
        <StatsCard
          title="Study Hours"
          value={`${totalStudyHours} Hours`}
          icon={<FaClock />}
        />

        <StatsCard
          title="Completed"
          value={dashboard.sessions.completedSessions}
          icon={<FaCheckCircle />}
        />

        <StatsCard
          title="Pending"
          value={dashboard.sessions.pendingSessions}
          icon={<FaClipboardList />}
        />
      </div>

    <div className="premium-insights-section">

  <div className="premium-insights-header">

    <h3>Premium Insights</h3>

    <span>
      ✨ Premium
    </span>

  </div>


  <div className="premium-insights-grid">
    
    <div className="premium-insight-grid">
    <PremiumGate
      isPremium={isPremium}
      onUpgrade={() =>
        setIsPremiumPosterOpen(true)
      }
    >

      <PremiumInsightCard
    title="This Week's Focus"
    value={
      premiumInsights.weeklyFocus.subject ||
      "No data"
    }
    description={
      `${weeklyFocusHours.toFixed(1)} hrs studied this week`
    }
    icon={<FaBook />}
  />

    </PremiumGate>
     </div>

      
    <div className="premium-insight-grid">
    <PremiumGate
      isPremium={isPremium}
      onUpgrade={() =>
        setIsPremiumPosterOpen(true)
      }
    >

      
  <PremiumInsightCard
    title="Weekly Performance"

    value={
      weeklyChange > 0
        ? `+${weeklyChange}%`
        : `${weeklyChange}%`
    }

    description={
      `${thisWeekHours.toFixed(1)} hrs this week · ${lastWeekHours.toFixed(1)} hrs last week`
    }

    icon={<FaClock />}

    trend={{
      type:
        weeklyChange > 0
          ? "positive"
          : weeklyChange < 0
          ? "negative"
          : "neutral",

      text:
        weeklyChange > 0
          ? "Improved from last week"
          : weeklyChange < 0
          ? "Lower than last week"
          : "Same as last week"
    }}
  />

    </PremiumGate>

    </div>

  </div>

</div>



      <div className="charts-container">
        <div className="study-chart">
          <WeeklyStudyChart weeklyData={formattedWeeklyData} />
        </div>

        <div className="subject-chart">
          <SubjectPieChart subjectData={formattedSubjectData} />
        </div>
      </div>

      <div className="foot-container">
        <div className="sessions-section">
          <RecentSessions recentSessions={dashboard.recentSessions} />
        </div>

        <div className="goal-section">
          <TodayGoalCard
            goalHours={dashboard.goalHours}
            completedHours={completedTodayHours}
            currentStreak={dashboard.streak}
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
  );
}

export default Dashboard;
