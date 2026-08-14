import razorpay from "../config/razorpay.js";
import pricing from "../config/pricing.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import crypto from "crypto";

export async function createOrder(req , res, next) {
    const {plan} = req.body;

    if(pricing[plan] === undefined){
        return res.status(400).json({
            success:false,
            message:"Select valid Plan "
        });
    }

    const amount = pricing[plan];

    try{
        const order = await razorpay.orders.create({
        amount:amount,
        currency:"INR",
        receipt:`receipt_${Date.now()}`
    });


    const userId = req.user.userId;

    const payment = await Payment.create({
        userId:userId,
        plan:plan,
        amount:order.amount,
        currency:order.currency,
        razorpayOrderId:order.id,
        status:"pending"

    });

    return res.status(200).json({
        success:true,
        message:"Order created successfully",
        data:{
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        }
    });
    
    } catch(error){
        next(error);
    }
    

}

// --------------------------------

export async function verifyPayment(req , res , next) {

    console.log("VERIFY PAYMENT HIT");

    const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
} = req.body.response;

console.log("Razorpay response:", req.body.response);

try{



    const generatedSignature = crypto
        .createHmac("sha256" , process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    const isMatch = generatedSignature === razorpay_signature;

    if(!isMatch){
        return res.status(400).json({
            success:false,
            message:"Payment verification failed"
        });
    }


    console.log("SIGNATURE VERIFIED");

    const payment = await Payment.findOne({
        razorpayOrderId:razorpay_order_id
    });

    if(!payment){
        return res.status(404).json({
            success:false,
            message:"Payment not exist"
        });
    }

    if(payment.status === "failed"){
        return res.status(400).json({
            success:false,
            message:"Payment verificatio alrady failed , plz proceed with new one"
        });
    }  
    
    if(payment.status === "success"){
        return res.status(400).json({
            success:false,
            message:"Payment already processed"
        });
    } 


    const user = await User.findById(payment.userId);

    if(!user){
        return res.status(400).json({
            success:false,
            message:"Associated user not found "
        });
    }


    const now = new Date();

    let startDate;
    let endDate;

    if(user.subscription.endDate && user.subscription.endData> now){
        //  existing subscripton active 
        startDate = user.subscription.endDate;
        endDate = new Date(user.subscription.endDate);
    } else {
        //  new subscripion 
        startDate = now;
        endDate = new Date(now);
    }

    if (payment.plan === "monthly") {
    endDate.setMonth(endDate.getMonth() + 1);
} else if (payment.plan === "yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1);
}


payment.status = "success";
payment.razorpayPaymentId = razorpay_payment_id;

user.subscription.plan = "premium";
user.subscription.startDate = startDate;
user.subscription.endDate = endDate;

console.log("BEFORE SAVE");
console.log("Payment:", payment);
console.log("Start:", startDate);
console.log("End:", endDate);
console.log("User subscription:", user.subscription);


await payment.save();
await user.save();

return res.status(200).json({
    success:true,
    message:"Payment verified succesfully",
    data:{
        plan:user.subscription.plan,
        startDate:user.subscription.startDate,
        endDate:user.subscription.endDate
    }
});


} catch(error){
    next(error);
}

} 