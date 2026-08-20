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