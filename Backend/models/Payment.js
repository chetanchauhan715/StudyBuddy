import mongoose from "mongoose";

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
        required:true
    },

    subscriptionApplied:{
    type:Boolean,
    default:false
    },

    fulfilledAt:{
    type:Date,
    default:null
    }
},

{
    timestamps:true
}

);

const Payment = mongoose.model("Payment" , PaymentSchema)
export default Payment;