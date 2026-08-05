import Subject from "../models/Subject.js";
import StudySession from "..//models/StudySession.js";

export async function  createSubject(req , res , next) {
    const {name} = req.body;

    try{
        const existingSubject = await Subject.findOne({
        userId:req.user.userId,
        name
    });

    if(existingSubject){
        return res.status(409).json({
            success:false,
            message:"Subject already exists"
        });
    }

    const newSubject = await Subject.create({
        userId:req.user.userId,
        name
    });
    return res.status(201).json({
        success:true,
        message:"Subject created succesfully",
        data:{
            newSubject
        }
    })

    } catch(error){
        next(error);
    }
    
}


export async function getSubjects(req , res, next){

    try{
        const subjects = await Subject.find({
            userId:req.user.userId
        });

        return res.status(200).json({
            success:true,
            message:"Subjects fetched succesfully",
            data:{
                subjects
            },
        });
    }
     catch(error){
        next(error);
     }
}

export async function editSubject(req , res , next){
    try{

        const {name} = req.body;

        const subject = await Subject.findOne({
            _id:req.params.id,
            userId:req.user.userId,

        });

        if(!subject){
            return res.status(404).json({
                success:false,
                message:"Subject not found"
            });
        }

        const duplicateSubject = await Subject.findOne({
            userId:req.user.userId,
            name,
            _id:{
                $ne:req.params.id
            }
        });

        if(duplicateSubject){
            return res.status(409).json({
                success:false,
                message:"Subject already exists"
            });
        }

        subject.name = name;
        await subject.save();

        return res.status(200).json({
            success:true,
            message:"Subject updated succesfully",
            data:{
                subject
            }
        })


    } catch(error){
        next(error);
    }
}


export async function deleteSubject(req, res, next){
    try{
        const subject = await Subject.findOne({
            _id:req.params.id,
            userId:req.user.userId
        });

        if(!subject){
            return res.status(404).json({
                success:false,
                message:"Subject not found"
            });
        }

        // DELETE ALL SUBJECT LINKED TO THIS SUBJECT

        await StudySession.deleteMany({
            subject: subject._id,
        });

        // DELETE SUBJECT
        await subject.deleteOne();
        
        return res.status(200).json({
            success:true, 
            message:"Subject deleted succesfully"
        });

    } catch(error){
        next(error);
    }

}