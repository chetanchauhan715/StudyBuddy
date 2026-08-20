import Reminder from "../models/Reminder.js";
import User from "../models/User.js";

export async function createReminder(req, res, next) {

    const { title, scheduledAt } = req.body;
    const userId = req.user.userId;

    try {

         // FIND USER

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // CHECK IF PREMIUM IS CURRENTLY ACTIVE

        const now = new Date();

        const isPremium =
            user.subscription?.plan === "premium" &&
            user.subscription?.endDate &&
            user.subscription.endDate > now;


        // FREE USER → ONLY 1 REMINDER PER DAY

        if (!isPremium) {

            const reminderDate = new Date(scheduledAt);

            // IST offset = +5:30
            const IST_OFFSET = 5.5 * 60 * 60 * 1000;

            const istDate = new Date(
                reminderDate.getTime() + IST_OFFSET
            );

            const startOfDayIST = new Date(
                Date.UTC(
                    istDate.getUTCFullYear(),
                    istDate.getUTCMonth(),
                    istDate.getUTCDate()
                ) - IST_OFFSET
            );

            const endOfDayIST = new Date(
                startOfDayIST.getTime() +
                24 * 60 * 60 * 1000
            );


            const existingReminder =
                await Reminder.findOne({

                    userId,

                    scheduledAt: {
                        $gte: startOfDayIST,
                        $lt: endOfDayIST
                    }

                });


            if (existingReminder) {

                return res.status(403).json({
                    success: false,
                    message:
                        "Free users can create only one reminder per day. Upgrade to Premium for unlimited reminders."
                });

            }

        }


        // CREATE REMINDER

        const reminder = await Reminder.create({
            title,
            scheduledAt,
            userId
        });


        return res.status(201).json({

            success: true,

            message: "Reminder created successfully",

            data: {
                reminder
            }

        });


    } catch (error) {

        next(error);
    }
}


// -----------

export async function getReminders(req , res , next) {
    const userId = req.user.userId;

    const today = new Date();
    
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);

    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    

    try{

        const todayReminders = await  Reminder.find({
            userId,
            scheduledAt:{
                $gte:startOfDay,
                $lte:endOfDay
            }
        }).sort({
            scheduledAt:-1
        });

        return res.status(200).json({
            success:true,
            message:"Today's reminder fetched succesfully",
            data:{
                todayReminders
            }
        })

    } catch(error){
        next(error);
    }
}


// TODO: make reminder day range timezone-aware for production


// export async function getReminders(req, res, next) {

//     const userId = req.user.userId;

//     try {

//         const now = new Date();

//         const IST_OFFSET = 5.5 * 60 * 60 * 1000;

//         // Convert current instant to IST representation
//         const nowIST = new Date(
//             now.getTime() + IST_OFFSET
//         );

//         // Start of today's IST calendar day, converted back to UTC
//         const startOfDay = new Date(
//             Date.UTC(
//                 nowIST.getUTCFullYear(),
//                 nowIST.getUTCMonth(),
//                 nowIST.getUTCDate()
//             ) - IST_OFFSET
//         );

//         // Start of tomorrow
//         const endOfDay = new Date(
//             startOfDay.getTime() +
//             24 * 60 * 60 * 1000
//         );


//         console.log("USER:", userId);
//         console.log("START:", startOfDay);
//         console.log("END:", endOfDay);


//         const todayReminders = await Reminder.find({

//             userId,

//             scheduledAt: {
//                 $gte: startOfDay,
//                 $lt: endOfDay
//             }

//         }).sort({
//             scheduledAt: 1
//         });


//         console.log(
//             "TODAY REMINDERS:",
//             todayReminders
//         );


//         return res.status(200).json({

//             success: true,

//             message:
//                 "Today's reminders fetched successfully",

//             data: {
//                 todayReminders
//             }

//         });


//     } catch (error) {

//         next(error);
//     }
// }


export async function deleteReminder(req , res , next) {
    const userId = req.user.userId;
    const {reminderId} = req.params;

    try{
        const deletedReminder = await Reminder.findOneAndDelete({
            userId,
            _id:reminderId,
            status:"pending"
        });


        if(!deletedReminder){
            return res.status(404).json({
                success:false,
                message:"Pending reminder not found"
            });
        }

        return res.status(200).json({
            success:true,
            message:"Reminder deleted succesfully",
        });
    } catch(error){
        next(error);
    }
}