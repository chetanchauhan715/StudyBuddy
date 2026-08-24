import mongoose from "mongoose";
import User from "../models/User.js";
import Notification from "../models/notification.js";


export async function getNotifications(req, res, next) {

    const userId = req.user.userId;

    try{
        
        const notifications = await Notification.find({userId})
        .sort({createdAt: -1})
        .limit(5);

        return res.status(200).json({
            success:true,
            message:"Notification fetched succesfully",
            notifications
        });

    } catch(error){
        next(error);
    }
    
}

// -------- no of unread notifications

export async function getUnreadNotificationCount(req , res , next) {
    const userId = req.user.userId;

    try{
        const unreadCount = await Notification.countDocuments({
            userId:userId,
            read:false
        });

        return res.status(200).json({
            success:true,
            message:"Notification count fetched succesfully",
            unreadCount
        })
    } catch(error){
        next(error);
    }
}

// --------- read notification 

export async function markNotificationAsRead(req , res, next) {
    
    const { notification_id } = req.params;
    const userId = req.user.userId;

    try{

    const notification = await Notification.findOne({
        _id:notification_id,
        userId:userId
    });


    if(!notification){
        return res.status(404).json({
            success:false,
            message:"Notification not found",
        });
    }

    notification.read = true;

    await notification.save();

    return res.status(200).json({
        success:true,
        message:"Notification mark as read"
    });
    
} catch(error){
    next(error);
}

}

// ----------- all notificaion read 

export async function markAllNotificationsAsRead(req, res, next) {

    const userId = req.user.userId;

    try {

        const result = await Notification.updateMany(
            {
                userId,
                read: false
            },
            {
                $set: {
                    read: true
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            data: {
                modifiedCount: result.modifiedCount
            }
        });

    } catch (error) {
        next(error);
    }
}