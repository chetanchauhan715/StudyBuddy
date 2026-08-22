import mongoose from "mongoose";
import StudySession from "../models/StudySession.js";
import User from "../models/User.js";


function getWeekRanges() {

    const now = new Date();

    const startOfThisWeek = new Date(now);

    const day = startOfThisWeek.getDay();

    const diffToMonday =
        day === 0
            ? -6
            : 1 - day;

    startOfThisWeek.setDate(
        startOfThisWeek.getDate() + diffToMonday
    );

    startOfThisWeek.setHours(
        0, 0, 0, 0
    );


    const startOfLastWeek =
        new Date(startOfThisWeek);

    startOfLastWeek.setDate(
        startOfLastWeek.getDate() - 7
    );


    return {
        now,
        startOfThisWeek,
        startOfLastWeek
    };
}

export async function getDashboard(req , res , next ) {

    const {now , startOfThisWeek} = getWeekRanges();

    
   
    try{
         const userId = req.user.userId;

        const sessions = await StudySession.aggregate([
        {
            $match:{
                user:new mongoose.Types.ObjectId(userId)
            }
        }, 
        
        {
            $group:{
                _id:null, 

                totalSessions:{
                    $sum:1
                }, 

                totalHours:{
                    $sum:"$duration"
                }, 

                completedSessions:{
                    $sum:{
                        $cond:[
                            {$eq : ["$status" , "Completed"]},
                            1,
                            0
                        ]
                    }
                }, 

                pendingSessions:{
                    $sum:{
                        $cond:[
                            {$eq:["$status" , "Pending"]},
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);


    const recentSessions = await StudySession.find({
        user:userId,
    })
    .populate("subject")
    .sort({
        createdAt:-1
    }).limit(5);

    const weeklyStudy = await StudySession.aggregate([
        {
            $match:{
                user:new mongoose.Types.ObjectId(userId),

                status:"Completed",

                studyDate:{
                    $gte:startOfThisWeek,
                    $lte:now
                }
            },

        },

        {
            $group:{
                _id:{
                    $dayOfWeek: "$studyDate"
                }, 

                hours:{
                    $sum:"$duration"
                }
            }
        }, 

        {
            $project:{
                _id:0,
                day:"$_id",
                hours:1
            }
        }
    ]);

    const subjectData = await StudySession.aggregate([
        {
            $match:{
                user:new mongoose.Types.ObjectId(userId)
            }
        },

        {
            $group:{
                _id:"$subject" ,

                hours:{
                    $sum:"$duration"
                }
            }
        }, 

        {
            $lookup:{
                from:"subjects",
                localField:"_id",
                foreignField:"_id",
                as:"subjectInfo"
            }
        },

        {
            $unwind:"$subjectInfo"
        },


        {
            $project:{
                _id:0,
                subject:"$subjectInfo.name",
                hours:1
            }
        }
    ]);

    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0,0,0,0);

    const endOfday = new Date(today);
    endOfday.setHours(23,59,59,999);

    const todayGoal = await StudySession.aggregate([
        {
            $match:{
                user:new mongoose.Types.ObjectId(userId),
                status:"Completed",
                studyDate:{
                    $gte:startOfDay,
                    $lte:endOfday
                },
            },
        },

        {
            $group:{
                _id:null,
                completedToday:{
                    $sum:"$duration"
                },
            },
        },
    ]);


    const completedSessions = await StudySession.find({
        user:userId,
        status:"Completed"
    }).sort({
        studyDate:-1,
    });

    const uniqueDays = new Set();
    for(const session of completedSessions){
        const day = session.studyDate.toISOString().split("T")[0];
        uniqueDays.add(day);
    }

    const uniqueDaysArray = [...uniqueDays];
    let streak = uniqueDaysArray.length > 0 ? 1 : 0;
    for(let i=0; i<uniqueDaysArray.length-1; i++){
        const currentDay = new Date(uniqueDaysArray[i]);
        const previousDay = new Date(uniqueDaysArray[i+1]);

        const difference = (currentDay - previousDay) / (1000*60*60*24);

        if(difference === 1){
            streak++;
        } else {
           break;
        }
    }

    const user = await User.findById(userId).select("name dailyGoal");

    
    return res.status(200).json({
        success:true,
        message:"Dashboard data fetched succesfully",
        data:{
            sessions:sessions[0] || {
            totalSessions: 0,
            totalHours: 0,
            completedSessions: 0,
            pendingSessions: 0,
            },

            recentSessions,
            weeklyStudy,
            subjectData,

            todayGoal: todayGoal[0] || {
                completedToday:0,
            },

            goalHours:user?.dailyGoal || 6,
            streak,
            user
        }
    });

    } catch (error){
        console.error(error);
        next(error)
    }
    
}




// -------------- premium insights 

export async function getPremiumDashboardInsights(req , res , next){
    const userId = req.user.userId;

    const {now , startOfThisWeek, startOfLastWeek} = getWeekRanges();

    try{


        const weeklyFocus = await StudySession.aggregate([
        {
            $match:{
                user:new mongoose.Types.ObjectId(userId),

                status:"Completed",

                studyDate:{
                    $gte:startOfThisWeek,
                    $lte:now
                }
            }
        },

        {
            $group:{
                _id:"$subject",

                hours:{
                    $sum:"$duration"
                }
            }
        },

        {
            $sort:{
                hours:-1
            }
        },

        {
            $limit:1
        },

        {
            $lookup:{
                from : "subjects",
                localField:"_id",
                foreignField:"_id",
                as:"subjectInfo"
            }
        },

        {
            $unwind:"$subjectInfo"
        },

        {
            $project:{
                _id:0,
                subject:"$subjectInfo.name",
                hours:1
            }
        }
    ]);


    const thisWeekData = await StudySession.aggregate([
        {
            $match:{
                user: new mongoose.Types.ObjectId(userId),

                status:"Completed",

                studyDate:{
                    $gte:startOfThisWeek,
                    $lte:now
                }
            }
        },

        {
            $group:{
                _id:null,

                hours:{
                    $sum:"$duration"
                }
            }
        }
    ]);


    const lastWeekData = await StudySession.aggregate([
        {
            $match:{
                user: new mongoose.Types.ObjectId(userId),

                status:"Completed",

                studyDate:{
                    $gte:startOfLastWeek,
                    $lt:startOfThisWeek
                }
            }
        },

        {
            $group:{
                _id:null,

                hours:{
                    $sum:"$duration"
                }
            }
        }
    ]);


    const thisWeekHours = thisWeekData[0]?.hours || 0;

    const lastWeekHours = lastWeekData[0]?.hours || 0;

    let weeklyChange = 0;

    if(lastWeekHours > 0){
        weeklyChange = ( (thisWeekHours - lastWeekHours) / lastWeekHours) * 100;
    } else if( thisWeekHours > 0){
        weeklyChange = 100;
    }


    weeklyChange = Math.round(weeklyChange);

    return res.status(200).json({
        success:true,
        message:"Dashboard premium insights fetched succesfully",
        data:{
             premiumInsights:{
                weeklyFocus: weeklyFocus[0]|| {
                subject:null,
                hours:0
                },

                weeklyPerformance:{
                    thisWeekHours,
                    lastWeekHours,
                    weeklyChange
                }
            }
        }
    })

    } catch(error){
        console.error(error);
        next(error);
    }
}