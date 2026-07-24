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
            uniue:true
        } ,

        password:{
            type:String,
            required:true
        }, 

        dailyGoal:{
            type:Number,
            default:6
        }
    }
);

const User = mongoose.model("User" , UserSchema);
export default User;