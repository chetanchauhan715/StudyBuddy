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