import express from "express";
import StudySession from "../models/StudySession.js";

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


        return res.status(200).json({
            success:true,
            message:"Statistics Fetched Succesfully",
            data:{
                totalSessions,
                completedSessions,
                pendingSessions,
                totalHours
            }

        });

    }
    catch (error){
        next(error)
    }
}