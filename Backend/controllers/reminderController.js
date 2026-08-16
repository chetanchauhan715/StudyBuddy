import Reminder from "../models/Reminder.js";

export async function createReminder(req, res, next) {
    const {title , scheduledAt} = req.body;

    const userId = req.user.userId;
    try{

    
    const reminder = await Reminder.create({
        title,
        scheduledAt,
        userId
    });

    return res.status(201).json({
        success:true,
        message:"Reminder created succesfully",
        data:{
            reminder
        }
    });

} catch(error){
    next(error);
}
}