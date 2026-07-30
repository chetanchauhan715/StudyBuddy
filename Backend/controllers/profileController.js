import bcrypt from "bcrypt";
import User from "../models/User.js";
import { Result } from "express-validator";

export async function  getProfile(req , res , next) {
    const userid = req.user.userId;

    try{

        const user = await User.findById(userid).select("name email dailyGoal createdAt");

    if(!user){
        return res.status(404).json({
            success:false,
            message:"User Not Found"
        });
    }

    return res.status(200).json({
            success:true, 
            message:"Profile fetched succesfully",
            data:{
                user
            }
        })

        
    } catch(error){
        next(error);
    }

    
}

// --------update profile 

export async function updateProfile(req, res , next) {
    const userId = req.user.userId;
    const {name , dailyGoal}=req.body;
    try{
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }

        user.name = name;
        user.dailyGoal = dailyGoal ;

        const updatedUser = await user.save();

        return res.status(200).json({
            success:true,
            message:"Profile Data Updated Succesfully",
            data:{
                user:updatedUser
            }

        })
    } catch(error){
        console.error(error);
        next(error);
    }

}

// ------ change pas

export async function changePassword(req , res , next) {
    const {currentPassword , newPassword, confirmPassword} = req.body;
    

    try{

        const user = await User.findById(req.user.userId);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }

        

        const isMatch = await bcrypt.compare(currentPassword , user.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Current Password is incorrect"
            });
        }

        if(newPassword != confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password do not match"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();
        
        return  res.status(200).json({
            success:true,
            message:"Password updated sucesfully"
    });



    } catch(error){
        next(error);
    }
    
}