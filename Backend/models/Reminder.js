import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    title:{
        type:String,
        required:true
    },

    scheduledAt:{
        type:Date,
        required:true
    },

    status:{
        type:String,
        enum:["pending" , "sent"],
        default:"pending"
    }
}, 
{
    timestamps:true
}
);

const Reminder = mongoose.model("Reminder" , ReminderSchema);
export default Reminder;