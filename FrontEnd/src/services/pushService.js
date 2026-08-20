import webpush from "web-push";

webpush.setVapidDetails(
    "mailto:your-email@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);


export async function sendPushNotification(
    subscription,
    payload
) {

    try {

        await webpush.sendNotification(
            subscription,
            JSON.stringify(payload)
        );

        console.log("Push notification sent successfully");

    } catch (error) {

        console.error(
            "Push notification failed:",
            error.message
        );

        throw error;
    }
}