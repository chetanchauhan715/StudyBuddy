import razorpay from "../config/razorpay.js";
import pricing from "../config/pricing.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import crypto from "crypto";
import mongoose from "mongoose";

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

export async function verifyPayment(req, res, next) {

    console.log("VERIFY PAYMENT HIT");

    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
    } = req.body.response;

    console.log("Razorpay response:", req.body.response);

    let session;

    try {

        // ---------------- SIGNATURE VERIFICATION 

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const isMatch = generatedSignature === razorpay_signature;

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        console.log("SIGNATURE VERIFIED");


        // ---------------- FIND PAYMENT 

        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
            userId: req.user.userId
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not exist"
            });
        }


        // ---------------- VERIFY RAZORPAY ORDER 

        const razorpayOrder = await razorpay.orders.fetch(
            razorpay_order_id
        );

        if (
            razorpayOrder.amount !== payment.amount ||
            razorpayOrder.currency !== payment.currency
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details do not match"
            });
        }


        // ---------------- PAYMENT STATUS 

        if (payment.status === "failed") {
            return res.status(400).json({
                success: false,
                message: "Payment verification already failed, please proceed with a new one"
            });
        }

        if (payment.status === "success") {
            return res.status(400).json({
                success: false,
                message: "Payment already processed"
            });
        }


        // ---------------- FIND USER 

        const user = await User.findById(payment.userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Associated user not found"
            });
        }


        // ---------------- CALCULATE SUBSCRIPTION 

        const now = new Date();

        let startDate;
        let endDate;

        if (
            user.subscription.endDate &&
            user.subscription.endDate > now
        ) {

            // Existing active subscription

            startDate = user.subscription.startDate;
            endDate = new Date(user.subscription.endDate);

        } else {

            // New subscription

            startDate = now;
            endDate = new Date(now);
        }


        if (payment.plan === "monthly") {

            endDate.setMonth(endDate.getMonth() + 1);

        } else if (payment.plan === "yearly") {

            endDate.setFullYear(endDate.getFullYear() + 1);
        }


        // ---------------- UPDATE DOCUMENTS 

        payment.status = "success";
        payment.razorpayPaymentId = razorpay_payment_id;

        user.subscription.plan = "premium";
        user.subscription.startDate = startDate;
        user.subscription.endDate = endDate;


        // ---------------- TRANSACTION 

        session = await mongoose.startSession();

        session.startTransaction();

        await payment.save({ session });
        await user.save({ session });

        await session.commitTransaction();

        session.endSession();


        // ---------------- RESPONSE 

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: {
                plan: user.subscription.plan,
                startDate: user.subscription.startDate,
                endDate: user.subscription.endDate
            }
        });


    } catch (error) {

        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        next(error);
    }
}


export async function handleWebhook(req, res, next) {

    console.log("🔥 WEBHOOK RECEIVED");
    console.log("Event:", req.body.event);

    try {

        const signature = req.headers["x-razorpay-signature"];

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_WEBHOOK_SECRET
            )
            .update(req.rawBody)
            .digest("hex");

        if (generatedSignature !== signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid webhook signature"
            });
        }

        const event = req.body;

        if (event.event === "payment.captured") {

            const paymentId = event.payload.payment.entity.id;
            const orderId = event.payload.payment.entity.order_id;

            const payment = await Payment.findOne({
                razorpayOrderId: orderId
            });

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: "Payment not found"
                });
            }

            if (payment.status === "pending") {
                payment.status = "success";
                payment.razorpayPaymentId = paymentId;

                await payment.save();
            }
        }

        if (event.event === "payment.failed") {

            const orderId = event.payload.payment.entity.order_id;

            const payment = await Payment.findOne({
                razorpayOrderId: orderId
            });

            if (payment && payment.status === "pending") {
                payment.status = "failed";

                await payment.save();
            }
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {
        next(error);
    }
}