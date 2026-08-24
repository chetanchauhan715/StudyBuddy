import "dotenv/config";

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";


// IMPORTANT:
// Keep false for the first run.
// Change to true only after checking the counts.
const APPLY_MIGRATION = false;


async function migrateUsers() {

    try {

        await connectDB();


        // =========================
        // DRY-RUN COUNTS
        // =========================

        const missingWeeklyGoal =
            await User.countDocuments({
                weeklyGoal: { $exists: false }
            });


        const missingSubscription =
            await User.countDocuments({
                subscription: { $exists: false }
            });


        const missingSubscriptionPlan =
            await User.countDocuments({
                "subscription.plan": { $exists: false }
            });


        const missingStartDate =
            await User.countDocuments({
                "subscription.startDate": { $exists: false }
            });


        const missingEndDate =
            await User.countDocuments({
                "subscription.endDate": { $exists: false }
            });



             const totalUsers =
            await User.countDocuments({});

        const premiumUsers =
            await User.countDocuments({
                "subscription.plan": "premium"
            });

        const freeUsers =
            await User.countDocuments({
                "subscription.plan": "free"
            });

        const usersWithWeeklyGoal =
            await User.countDocuments({
                weeklyGoal: { $exists: true }
            });



        console.log("\n========== MIGRATION PREVIEW ==========");

        console.log(
    "Total users:",
    totalUsers
);

console.log(
    "Existing premium users:",
    premiumUsers
);

console.log(
    "Existing free users:",
    freeUsers
);

console.log(
    "Already have weeklyGoal:",
    usersWithWeeklyGoal
);

console.log("------------------------------");

        console.log(
            "Missing weeklyGoal:",
            missingWeeklyGoal
        );

        console.log(
            "Missing subscription object:",
            missingSubscription
        );

        console.log(
            "Missing subscription.plan:",
            missingSubscriptionPlan
        );

        console.log(
            "Missing subscription.startDate:",
            missingStartDate
        );

        console.log(
            "Missing subscription.endDate:",
            missingEndDate
        );

        console.log("=======================================\n");


        // =========================
        // SAFETY STOP
        // =========================

        if (!APPLY_MIGRATION) {

            console.log(
                "DRY RUN ONLY — no database changes were made."
            );

            return;
        }


        // =========================
        // WEEKLY GOAL
        // =========================

        const weeklyGoalResult =
            await User.updateMany(
                {
                    weeklyGoal: { $exists: false }
                },
                {
                    $set: {
                        weeklyGoal: 0
                    }
                }
            );


        // =========================
        // SUBSCRIPTION PLAN
        // =========================

        const planResult =
            await User.updateMany(
                {
                    "subscription.plan": {
                        $exists: false
                    }
                },
                {
                    $set: {
                        "subscription.plan": "free"
                    }
                }
            );


        // =========================
        // SUBSCRIPTION START DATE
        // =========================

        const startDateResult =
            await User.updateMany(
                {
                    "subscription.startDate": {
                        $exists: false
                    }
                },
                {
                    $set: {
                        "subscription.startDate": null
                    }
                }
            );


        // =========================
        // SUBSCRIPTION END DATE
        // =========================

        const endDateResult =
            await User.updateMany(
                {
                    "subscription.endDate": {
                        $exists: false
                    }
                },
                {
                    $set: {
                        "subscription.endDate": null
                    }
                }
            );


        console.log("\n========== MIGRATION RESULT ==========");


        console.log(
            "weeklyGoal matched:",
            weeklyGoalResult.matchedCount
        );

        console.log(
            "weeklyGoal modified:",
            weeklyGoalResult.modifiedCount
        );


        console.log(
            "\nsubscription.plan matched:",
            planResult.matchedCount
        );

        console.log(
            "subscription.plan modified:",
            planResult.modifiedCount
        );


        console.log(
            "\nsubscription.startDate matched:",
            startDateResult.matchedCount
        );

        console.log(
            "subscription.startDate modified:",
            startDateResult.modifiedCount
        );


        console.log(
            "\nsubscription.endDate matched:",
            endDateResult.matchedCount
        );

        console.log(
            "subscription.endDate modified:",
            endDateResult.modifiedCount
        );


        console.log("======================================\n");


    } catch (error) {

        console.error(
            "Migration failed:",
            error
        );

    } finally {

        await mongoose.disconnect();

        console.log(
            "MongoDB connection closed."
        );
    }
}


migrateUsers();