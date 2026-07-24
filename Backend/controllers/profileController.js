import User from "../models/User.js";

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