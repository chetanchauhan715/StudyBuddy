import express from "express";
import StudySession from "../models/StudySession.js";
import mongoose from "mongoose";

export async function createStudySessions(req,res , next){
    // console.log(req.body);
    const {subject , topic , duration , status, studyDate} = req.body;

    // if(!subject || !duration || !status){
    //     return res.status(400).send("Please fill all the requied Fields");
    // }

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
        console.log("New Study session created Succesfully");
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
        query.$or = [
            {
                subject:{
                    $regex:search,
                    $options:"i"
                }
            },

            {
            topic:{
                $regex:search,
                $options:"i"
             }

            }
        ]
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
    // console.log("UPDATE API HIT");
    try{
        const {id} = req.params;
        const {subject , topic , duration , status , studyDate} = req.body;

        // console.log("BODY:", req.body);
        // console.log("Duration received:", duration);

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

        // session.duration = duration;
        console.log("Session before save:", session);

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
    // console.log("✅ getStatistics controller called");
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
        // console.log(sessions[0]);
        const totalHours = sessions.reduce( (total , session) => total + session.duration , 0);


        const weeklyHours = await StudySession.aggregate([
            {
              $match: {
                user: new mongoose.Types.ObjectId(req.user.userId)
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

        // console.log(weeklyHours);

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
            $sort:{
                totalMinutes:-1
            }
        }
    ]);

    const formattedSubjectDistribution = subjectWiseDistribution.map((item) => ({
        subject:item._id,
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
        const expectedDateString = expectedDate.toISOString().split("T")[0];

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