import mongoose from "mongoose";
import User from "./User.js";

const PaymentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    plan:{
        type:String,
        enum:["monthly" , "yearly"],
        required:true
    }, 

    amount:{
        type:Number,
        required:true
    },

    currency:{
        type:String,
        default:"INR"
    },

    razorpayOrderId:{
        type:String,
        required:true
    },

    razorpayPaymentId:{
        type:String,
        // required:true,
    },

    razorpaySignature:{
        type:String
    },

    status:{
        type:String,
        enum:["pending", "success", "failed"],
        require:true
    },
},

{
    timestamps:true
}

);

const Paymet = mongoose.model("Payment" , PaymentSchema)
export default Paymet;