import express from "express";
import StudySession from "../models/StudySession.js";
import mongoose from "mongoose";
import Subject from "../models/Subject.js";
import User from "../models/User.js";
import Notification from "../models/notification.js";


// -------- week range - helper 

function getWeekRanges(){
    const now = new Date();

    // - ---- current week  js: sun = 0, mon=1, sun=6

    const startOfThisWeek = new Date(now);

    const currentDay = startOfThisWeek.getDay();

    const diffToMonday = currentDay === 0 ? -6 : 1- currentDay;

    startOfThisWeek.setDate(startOfThisWeek.getDate() + diffToMonday);

    startOfThisWeek.setHours(0, 0, 0, 0);


    // --- last week -------- 

    const startOfLastWeek = new Date(startOfThisWeek);

    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    return {
        now , startOfThisWeek, startOfLastWeek
    };
}


// ----------- Date convert helper - local date 

function getLocalDateString(date){

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


export async function createStudySessions(req,res , next){
    const {subject , topic , duration , status, studyDate} = req.body;

    const newStudySession = {
        subject , 
        topic , 
        duration,
        status, 
        studyDate,
        user:req.user.userId
    }

    try{

      const session =   await StudySession.create(newStudySession);

      await Notification.create({
        userId:req.user.userId,
        content: `Study session "${topic}"`
      });

      
        return res.status(201).json({
            success:true,
            message:"Study sessin Created Succesfully",
            data:{
                session
            }
        });
    } catch (error){
        next(error);
    }
};

//-------- study session get Functionality 

export async function getStudySessions(req , res, next){

    const {search , status, subject ,  sort , order, page , limit} = req.query;

    let query = { user :req.user.userId};

    const sortField = sort || "createdAt";
    const sortDirection = order || "desc";
    const sortOrder = sortDirection === "asc" ? 1 : -1;

    let sortQuery = {
        [sortField]:sortOrder
    };

    if(search){
        const matchingSubjects = await Subject.find({
            name:{
                $regex:search,
                $options:"i"
            }
        });
        const subjectIds = matchingSubjects.map( (subject)=> subject._id);

        query.$or =[
            {
                topic:{
                    $regex:search,
                    $options:"i"
                }
            },
            {
                subject:{
                    $in:subjectIds
                }
            }
        ];
    }

    if(status){
        query.status = status;
    }

    if(subject){
        query.subject = subject;
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const skip = (pageNumber - 1) * limitNumber

 
    try{

        const totalSessions = await StudySession.countDocuments(query);

        const totalPages = Math.ceil(totalSessions / limitNumber);


       const sessions = await StudySession.find(query)
       .populate("subject")
       .sort(sortQuery)
       .skip(skip)
       .limit(limitNumber);


       return res.status(200).json({
        success:true, 
        message:"Study Sessions Fetched Succesfully",
        data:sessions,
        currentPage:pageNumber,
        totalPages,
        totalSessions,
        limit:limitNumber

       });
    } catch (error){
         next(error);
     }
};

// --------- study session update functionality 

export async function updateStudySession(req , res, next){
    try{
        const {id} = req.params;
        const {subject , topic , duration , status , studyDate} = req.body;

        

        const session = await StudySession.findOne({
            _id:id , 
            user:req.user.userId
        });
        if(!session){
            
            return res.status(404).json({
                success:false,
                message:"Study Session Not Found"
            });
        } 

        session.subject = subject;
        session.topic = topic ;
        session.duration = duration;
        session.status = status;
        session.studyDate = studyDate;

        

        await session.save();
        return res.status(200).json({
            success:true,
             message:"Study Session Succesfully Updated",
            data:{
                session
                }
        });
        
        

    } catch (error){
       next(error);
    }
};


// ------ delete session functinality 

export async function removeStudySession(req , res, next){
    try{
        const {id} = req.params;
        const session = await StudySession.findOne({
            _id:id,
            user:req.user.userId
        });
        if(!session){
            return res.status(404).json({
                success:false,
                message:"Study Session Not Found"
            });
        } 

        await session.deleteOne();
        return res.status(200).json({
            success:true,
            message:"Study Session Deleted Succesfully"
        });
    } catch (error){
        next(error);
    }
}

//-------- get statistics data - 
export async function getStatistics(req , res , next) {

    const {
        now,
        startOfThisWeek
    } = getWeekRanges();


    try{
        const baseQuery = {
            user:req.user.userId
        };

        const totalSessions = await StudySession.countDocuments( baseQuery);

        const completedSessions = await StudySession.countDocuments( {
            ...baseQuery , 
            status:"Completed"
        });

        const pendingSessions = await StudySession.countDocuments({
            ...baseQuery, 
            status:"Pending"
        });

        const sessions = await StudySession.find(baseQuery);
        const totalHours = sessions.reduce( (total , session) => total + session.duration , 0);


        const weeklyHours = await StudySession.aggregate([
            {
              $match: {
                user: new mongoose.Types.ObjectId(req.user.userId),
                status:"Completed",

                studyDate:{
                    $gte:startOfThisWeek,
                    $lte:now
                }
                
            }
            },

            {
                $project:{
                    day:{
                        $dayOfWeek:"$studyDate"
                    },
                    duration:1
                }
            },

            {
                $group:{
                    _id:"$day",

                    totalMinutes:{
                        $sum:"$duration"
                    }
                }
            },

            {
                $sort:{
                    _id:1
                }
            }

        ]);


        const weekDays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
];

    const formattedWeeklyHours = weeklyHours.map( (day)=> ({
        day:weekDays[day._id-1],
        hours:day.totalMinutes / 60
    }));


    const subjectWiseDistribution = await StudySession.aggregate([

        {
            $match:{
                user:new mongoose.Types.ObjectId(req.user.userId)
            }
        } ,

        {
            $group:{
                _id:"$subject",

                totalMinutes:{
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
                totalMinutes:1
            }
        },
        
        {
            $sort:{
                totalMinutes:-1
            }
        }
    ]);

    const formattedSubjectDistribution = subjectWiseDistribution.map((item) => ({
        subject:item.subject,
        hours:item.totalMinutes / 60 ,
    }));


    const completionRate =  totalSessions === 0 ? 
    0 :
    Number(((completedSessions / totalSessions) * 100).toFixed(1));

    const averageSessionDuration = totalSessions === 0 ? 0 : Number((totalHours / totalSessions).toFixed(1));

    const favoriteSubject = formattedSubjectDistribution.length > 0 ? formattedSubjectDistribution[0].subject : "No Data";

    const studyDates = await StudySession.aggregate([
        {
            $match:{
                user: new mongoose.Types.ObjectId(req.user.userId),
                    status:"Completed"
            }
        },

        {
            $group:{
            _id:{
                $dateToString:{
                    format:"%Y-%m-%d",
                    date:"$studyDate"
                }
            }
            }
        },

        {
            $sort:{
                _id:-1
            }
        }
    ]);

    let currentStreak = 0;
    let expectedDate = new Date();
    expectedDate.setHours(0,0,0,0);

    for(const session of studyDates){
        const expectedDateString =
    getLocalDateString(expectedDate);

        if(session._id === expectedDateString){
            currentStreak++;
            expectedDate.setDate(expectedDate.getDate()-1); // setting today date as yesterday at every step 
            
        } else {
            break;
        }
    }


        return res.status(200).json({
            success:true,
            message:"Statistics Fetched Succesfully",
            data:{
                totalSessions,
                completedSessions,
                pendingSessions,
                totalHours,
                completionRate,
                averageSessionDuration,
                favoriteSubject,
                currentStreak,
                formattedWeeklyHours,
                formattedSubjectDistribution
            }

        });

    }
    catch (error){
        next(error)
    }
}

// ---------------- premium statistics insights 
export async function getPremiumStatistics(req, res, next) {
    const userId = req.user.userId;

    const {
         now , 
         startOfThisWeek,
          startOfLastWeek
        } = getWeekRanges();


        //   console.log("NOW:", now);
        // console.log("START THIS WEEK:", startOfThisWeek);
        // console.log("START LAST WEEK:", startOfLastWeek);

        // const weeklyTest = await StudySession.find({
        //     user: new mongoose.Types.ObjectId(userId),
        //     status: "Completed",
        //     studyDate: {
        //         $gte: startOfThisWeek,
        //         $lte: now
        //     }
        // }).select("studyDate duration status");

        // console.log("WEEKLY TEST:", weeklyTest);


    try {

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        // =========================
        // MOST PRODUCTIVE DAY
        // =========================

        const productiveDayData =
            await StudySession.aggregate([

                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId),
                        status: "Completed",
                        studyDate: {
                            $gte: startOfMonth,
                            $lte: now
                        }
                    }
                },

                {
                    $group: {
                        _id: {
                            $dayOfWeek: "$studyDate"
                        },

                        totalMinutes: {
                            $sum: "$duration"
                        }
                    }
                },

                {
                    $sort: {
                        totalMinutes: -1
                    }
                },

                {
                    $limit: 1
                }

            ]);


        const weekDays = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ];


        const mostProductiveDay =
            productiveDayData.length > 0
                ? {
                    day:
                        weekDays[
                            productiveDayData[0]._id - 1
                        ],

                    totalMinutes:
                        productiveDayData[0].totalMinutes
                }
                : {
                    day: null,
                    totalMinutes: 0
                };


                // ---------

                const startOfCurrentMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
);

const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
);

const startOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
);


const currentMonthData = await StudySession.aggregate([

    {
        $match: {
            user: new mongoose.Types.ObjectId(userId),
            status: "Completed",

            studyDate: {
                $gte: startOfCurrentMonth,
                $lt: startOfNextMonth
            }
        }
    },

    {
        $group: {
            _id: null,

            totalMinutes: {
                $sum: "$duration"
            }
        }
    }

]);


const previousMonthData = await StudySession.aggregate([

    {
        $match: {
            user: new mongoose.Types.ObjectId(userId),
            status: "Completed",

            studyDate: {
                $gte: startOfPreviousMonth,
                $lt: startOfCurrentMonth
            }
        }
    },

    {
        $group: {
            _id: null,

            totalMinutes: {
                $sum: "$duration"
            }
        }
    }

]);


const currentMonthMinutes =
    currentMonthData[0]?.totalMinutes || 0;

const previousMonthMinutes =
    previousMonthData[0]?.totalMinutes || 0;




    let monthlyChange = 0;

if (previousMonthMinutes > 0) {

    monthlyChange =
        (
            (currentMonthMinutes - previousMonthMinutes)
            /
            previousMonthMinutes
        ) * 100;

} else if (currentMonthMinutes > 0) {

    monthlyChange = 100;
}

monthlyChange = Math.round(monthlyChange);

// ------------------------- consistenly rate 

const activeStudyDaysData = await StudySession.aggregate([

    {
        $match: {
            user: new mongoose.Types.ObjectId(userId),
            status: "Completed",

            studyDate: {
                $gte: startOfCurrentMonth,
                $lt: startOfNextMonth
            }
        }
    },

    {
        $group: {
            _id: {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$studyDate"
                }
            }
        }
    },

    {
        $count: "activeDays"
    }

]);


const activeDays =
    activeStudyDaysData[0]?.activeDays || 0;

const daysElapsed =
    now.getDate();

const consistencyRate =
    daysElapsed === 0
        ? 0
        : Math.round(
            (activeDays / daysElapsed) * 100
        );


        // -------------- Weekly report 
        
        const weeklyReportBase = await StudySession.aggregate([
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
                    _id:null, 

                    totalMinutes:{
                        $sum:"$duration"
                    },

                    completedSessions:{
                        $sum:1
                    },

                    activeDays:{
                        $addToSet:{
                            $dateToString:{
                                format:"%Y-%m-%d",
                                date:"$studyDate"
                            }
                        }
                    }
                }
            },

            {
                $project:{
                    _id:0,
                    totalMinutes:1,
                    completedSessions:1,

                    activeDays:{
                        $size:"$activeDays"
                    }
                }
            }
        ]);

        const weeklyBase = weeklyReportBase[0] || {
            totalMinutes:0,
            completedSessions:0,
            activeDays:0
        };



        // ----- top focus subject this week 

        const weeklyFocusData = await StudySession.aggregate([
    {
        $match: {
            user: new mongoose.Types.ObjectId(userId),
            status: "Completed",
            studyDate: {
                $gte: startOfThisWeek,
                $lte: now
            }
        }
    },

    {
        $group: {
            _id: "$subject",

            totalMinutes: {
                $sum: "$duration"
            }
        }
    },

    {
        $sort: {
            totalMinutes: -1
        }
    },

    {
        $limit: 1
    },

    {
        $lookup: {
            from: "subjects",
            localField: "_id",
            foreignField: "_id",
            as: "subjectInfo"
        }
    },

    {
        $unwind: "$subjectInfo"
    },

    {
        $project: {
            _id: 0,
            subject: "$subjectInfo.name",
            totalMinutes: 1
        }
    }
]);

const weeklyFocus =
    weeklyFocusData[0] || {
        subject: null,
        totalMinutes: 0
    };



    // ----------- best day this week 

    const bestDayData = await StudySession.aggregate([
    {
        $match: {
            user: new mongoose.Types.ObjectId(userId),
            status: "Completed",
            studyDate: {
                $gte: startOfThisWeek,
                $lte: now
            }
        }
    },

    {
        $group: {
            _id: {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$studyDate"
                }
            },

            totalMinutes: {
                $sum: "$duration"
            }
        }
    },

    {
        $sort: {
            totalMinutes: -1
        }
    },

    {
        $limit: 1
    }
]);

const bestDay =
    bestDayData[0]
        ? {
            date: bestDayData[0]._id,
            totalMinutes: bestDayData[0].totalMinutes
        }
        : {
            date: null,
            totalMinutes: 0
        };



        // ----- last weeks total ---

        const lastWeekReportData = await StudySession.aggregate([
    {
        $match: {
            user: new mongoose.Types.ObjectId(userId),
            status: "Completed",
            studyDate: {
                $gte: startOfLastWeek,
                $lt: startOfThisWeek
            }
        }
    },

    {
        $group: {
            _id: null,

            totalMinutes: {
                $sum: "$duration"
            }
        }
    }
]);


const lastWeekMinutes =
    lastWeekReportData[0]?.totalMinutes || 0;

let weeklyChange = 0;

if (lastWeekMinutes > 0) {

    weeklyChange = Math.round(
        (
            (weeklyBase.totalMinutes - lastWeekMinutes)
            / lastWeekMinutes
        ) * 100
    );

} else if (weeklyBase.totalMinutes > 0) {

    weeklyChange = 100;
}

// --------- weekly goal and progress 

const user = await User.findById(userId).select("weeklyGoal");


const weeklyGoal =
    user?.weeklyGoal || 0;

const studiedHours =
    weeklyBase.totalMinutes / 60;

const goalProgress =
    weeklyGoal > 0
        ? Math.min(
            Math.round(
                (studiedHours / weeklyGoal) * 100
            ),
            100
        )
        : 0;



        // RESPONSE ----------- 


        return res.status(200).json({
            success: true,
            message:
                "Premium statistics fetched successfully",

            data: {
                mostProductiveDay,

                monthlyTrend: {
                    currentMonthMinutes,
                    previousMonthMinutes,
                    monthlyChange
                },
                consistencyRate: {
                    activeDays,
                    daysElapsed,
                    percentage: consistencyRate
                }, 

                weeklyReport: {
                    totalMinutes: weeklyBase.totalMinutes,
                    completedSessions: weeklyBase.completedSessions,
                    activeDays: weeklyBase.activeDays, 

                    weeklyFocus, 
                    bestDay, 

                    lastWeekMinutes, 
                    weeklyChange, 

                    weeklyGoal, 
                    goalProgress
                }
            }
        });


    } catch (error) {
        next(error);
    }
}