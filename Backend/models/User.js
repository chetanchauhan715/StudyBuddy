import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
    {
        plan:{
            type:String,
            enum:["free", "premium"],
            default:"free"
        },

        startDate:{
            type:Date,
            default:null
        },

        endDate:{
            type:Date,
            default:null
        }
    }, 

    {
        _id:false
    }
);

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

        weeklyGoal:{
            type:Number,
            default:0
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
        },

        subscription:{
            type:SubscriptionSchema, 
            default: () => ({})
        }
        
    }, 

    {
        timestamps:true
    }
);

const User = mongoose.model("User" , UserSchema);
export default User;