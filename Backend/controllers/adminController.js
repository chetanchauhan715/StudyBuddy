import StudySession from "../models/StudySession.js";
import User from "../models/User.js";

export async function getAdminDashboard (req , res, next) {
    
    const today = new Date();
    today.setHours(0,0,0,0);

    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    lastWeekDate.setHours(0,0,0,0,);


    try{
        const totalUsers = await User.countDocuments();
        const newUsersToday = await User.countDocuments({createdAt:{$gte:today}});
        const newUsersThisWeek = await User.countDocuments({createdAt:{$gte:lastWeekDate}});
        const totalSessions = await StudySession.countDocuments();
        const totalStudyMinutes = (await StudySession.find().select("duration")).reduce(
            (total , current )=> total += current.duration, 0
        );
        const recentUsers = await User.find().select("name email  createdAt").sort({createdAt: -1}).limit(5);


        const sessions = await StudySession.find({
            studyDate:{
                $gte:lastWeekDate
            }
        });

        const dailyStudyTrend = {};

       const dayName = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
];

        for(const session of sessions){
            const dayNumber = session.studyDate.getDay();
            const day = dayName[dayNumber];

           if(!dailyStudyTrend[day]){
            dailyStudyTrend[day] = session.duration;
           } else {
            dailyStudyTrend[day] += session.duration;
           }

        }

        const chartData = [];
        for( const day of dayName){
            chartData.push({
                day ,
                totalTime:dailyStudyTrend[day] ?? 0
            });
        }


        
        const completedStudySessions = await StudySession.countDocuments({status:"Completed"});
        const pendingStudySessinos = totalSessions - completedStudySessions;

        const pieChartData = [
            {
                name:"Completed",
                value:completedStudySessions
            },

            {
                name:"Pending",
                value:pendingStudySessinos
            }
        ];



        return res.status(200).json({
            success:true,
            message:"Dashboard data fetched succesfully",
            data:{
                totalUsers,
                newUsersToday,
                newUsersThisWeek,
                totalSessions,
                totalStudyMinutes,
                recentUsers,
                chartData,
                pieChartData
            }
        })

    } catch(error){
        next(error);
    }
}