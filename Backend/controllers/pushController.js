import webpush from "../config/webPush.js";
import PushSubscription from "../models/PushSubscription.js";


export async function savePushSubscription(req, res, next) {

    const userId = req.user.userId;
    const { endpoint, keys } = req.body;

    try {

        const subscription =
            await PushSubscription.findOneAndUpdate(

                {
                    userId,
                    endpoint
                },

                {
                    userId,
                    endpoint,
                    keys
                },

                {
                    new: true,
                    upsert: true
                }
            );


        return res.status(200).json({

            success: true,

            message:
                "Push subscription saved successfully",

            data: {
                subscription
            }

        });

    } catch (error) {

        next(error);
    }
}



export function getVapidPublicKey(req, res) {

    return res.status(200).json({

        publicKey:
            process.env.VAPID_PUBLIC_KEY

    });
}

// .-------------------

export async function testPushNotification(req, res, next) {

    const userId = req.user.userId;

    try {

        const subscription =
            await PushSubscription.findOne({
                userId
            }).sort({
                createdAt: -1
            });


        if (!subscription) {

            return res.status(404).json({

                success: false,

                message:
                    "Push subscription not found"

            });

        }


        console.log("TEST SUBSCRIPTION:");
        console.log(
            "Endpoint:",
            subscription.endpoint
        );

        console.log(
            "Has p256dh:",
            !!subscription.keys?.p256dh
        );

        console.log(
            "Has auth:",
            !!subscription.keys?.auth
        );


        const payload = {

            title: "StudyBuddy Test",

            body:
                "Push notification is working! 🔥"

        };


        await sendPushNotification(
            {
                endpoint:
                    subscription.endpoint,

                keys:
                    subscription.keys
            },

            payload
        );


        return res.status(200).json({

            success: true,

            message:
                "Push notification sent"

        });

    } catch (error) {

        next(error);
    }
}


// ----------------
export async function sendPushNotification(
    subscription,
    payload
) {

    try {

        const result =
            await webpush.sendNotification(

                subscription,

                JSON.stringify(payload)

            );


        console.log(
            "Push notification sent successfully"
        );


        return result;


    } catch (error) {

        console.error(
            "Push notification failed:",
            error.message
        );


        throw error;
    }
}


// savePushSubscription()
//         ↓
// Save browser/device address in MongoDB


// getVapidPublicKey()
//         ↓
// Give public key to browser


// testPushNotification()
//         ↓
// Find latest device
//         ↓
// Send test notification


// sendPushNotification()
//         ↓
// Actual web-push sending function