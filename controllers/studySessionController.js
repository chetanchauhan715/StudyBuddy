import express from "express";
import StudySession from "../models/StudySession.js";

export async function createStudySessions(req,res , next){
    const {subject , topic , duration , status} = req.body;

    // if(!subject || !duration || !status){
    //     return res.status(400).send("Please fill all the requied Fields");
    // }

    const newStudySession = {
        subject , 
        topic , 
        duration,
        status, 
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
    try{
        const sessions =  await StudySession.find({user:req.user.userId});
        return res.status(200).json({
            success:true,
            message:"Sessions fetched Succesfully",
            data:{
                sessions

            }
        });
     }
     catch (error){
         next(error);
     }
};

// --------- study session update functionality 

export async function updateStudySession(req , res, next){
    try{
        const {id} = req.params;
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

        session.status = "Completed";
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