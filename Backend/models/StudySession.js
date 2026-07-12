import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

    subject:{
        type:String,
        required:true
    } , 

    topic:{
        type:String
    },

    duration:{
        type:Number,
        required:true
    },

    status:{
        type:String,
        enum:["Pending" , "Completed"],
        required:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    
},

{
    timestamps:true
}

);

const StudySession = mongoose.model("StudySession" , sessionSchema);

export default StudySession;