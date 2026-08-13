// One-time migration:
// Adds the default free subscription structure to existing users.
// Already executed on the production Atlas database.
// Safe to keep for historical/reference purposes.

import "dotenv/config";

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

async function migrateUsers() {

    try {

        await connectDB();

        // Find users who don't have subscription field
        const usersWithoutSubscription =
            await User.countDocuments({
                subscription: { $exists: false }
            });

        console.log(
            "\nUsers that will be migrated:",
            usersWithoutSubscription
        );

        // Safety check:
        // If nobody needs migration, don't perform any update.
        if (usersWithoutSubscription === 0) {

            console.log(
                "No users need migration. Nothing changed."
            );

            return;
        }

        // Add subscription only to users
        // who don't already have one.
        const result = await User.updateMany(
            {
                subscription: { $exists: false }
            },
            {
                $set: {
                    subscription: {
                        plan: "free",
                        startDate: null,
                        endDate: null
                    }
                }
            }
        );

        console.log("\n========== MIGRATION RESULT ==========");

        console.log(
            "Matched users:",
            result.matchedCount
        );

        console.log(
            "Modified users:",
            result.modifiedCount
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