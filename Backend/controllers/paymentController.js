import razorpay from "../config/razorpay.js";
import pricing from "../config/pricing.js";
import Payment from "../models/Payment.js";

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