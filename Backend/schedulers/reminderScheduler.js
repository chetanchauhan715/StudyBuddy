import cron from "node-cron";

import Reminder from "../models/Reminder.js";
import PushSubscription from "../models/PushSubscription.js";

import {
    sendPushNotification
} from "../controllers/pushController.js";


function startReminderScheduler() {

    cron.schedule("* * * * *", async () => {

        try {

            // FIND DUE REMINDERS

            const dueReminders = await Reminder.find({

                status: "pending",

                scheduledAt: {
                    $lte: new Date()
                }

            });


            console.log(
                "Due reminders:",
                dueReminders.length
            );


            // PROCESS EACH REMINDER

            for (const reminder of dueReminders) {

                console.log(
                    "Processing reminder:",
                    reminder._id
                );


                // GET ALL DEVICES FOR THIS USER

                const subscriptions =
                    await PushSubscription.find({

                        userId: reminder.userId

                    });


                if (subscriptions.length === 0) {

                    console.log(
                        "No push subscriptions found for user:",
                        reminder.userId
                    );

                    continue;
                }


                // REMINDER PAYLOAD

                const payload = {

                    title: "StudyBuddy Reminder",

                    body: reminder.title,

                    reminderId:
                        reminder._id.toString()

                };


                // Did at least one device receive push?
                let delivered = false;


                // SEND TO EVERY USER DEVICE

                for (const subscription of subscriptions) {

                    try {

                        await sendPushNotification(

                            {
                                endpoint:
                                    subscription.endpoint,

                                keys:
                                    subscription.keys
                            },

                            payload

                        );


                        delivered = true;


                    } catch (error) {

                        console.error(
                            "Push failed:",
                            error.statusCode,
                            subscription.endpoint
                        );


                        // DEAD / EXPIRED SUBSCRIPTION

                        if (
                            error.statusCode === 404 ||
                            error.statusCode === 410
                        ) {

                            await PushSubscription
                                .findByIdAndDelete(
                                    subscription._id
                                );


                            console.log(
                                "Removed expired push subscription"
                            );
                        }


                        // IMPORTANT:
                        // do NOT throw here.
                        //
                        // One broken device should NOT
                        // stop other devices/reminders.
                    }

                }


                // MARK REMINDER AS SENT

                if (delivered) {

                    reminder.status = "sent";

                    await reminder.save();


                    console.log(
                        "Reminder marked as sent:",
                        reminder._id
                    );

                } else {

                    console.log(
                        "Reminder was not delivered:",
                        reminder._id
                    );

                }

            }


        } catch (error) {

            console.error(
                "Reminder scheduler error:",
                error
            );

        }

    });

}


export default startReminderScheduler;