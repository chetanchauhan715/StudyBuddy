import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        } ,

        email:{
            type:String,
            required:true,
            unique:true
        } ,

        password:{
            type:String,
            required:true
        }, 

        dailyGoal:{
            type:Number,
            default:6
        }, 

        passwordResetToken:{
            type:String,
        },

        passwordResetExpires:{
            type:Date,
        },

        role:{
            type:String,
            enum:["user" , "admin"],
            default:"user",
        }
        
    }, 

    {
        timestamps:true
    }
);

const User = mongoose.model("User" , UserSchema);
export default User;