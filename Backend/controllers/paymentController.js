import razorpay from "../config/razorpay.js";
import pricing from "../config/pricing.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import crypto from "crypto";
import mongoose from "mongoose";


// --------- resusable internal helper 
async function fulfillPremiumPayment({
    payment,
    razorpayPaymentId,
    razorpaySignature = null,
    session
}) {

    // ---------------------------------
    // ALREADY FULFILLED PAYMENT
    // ---------------------------------

    if (payment.subscriptionApplied) {

        if (
            payment.razorpayPaymentId &&
            payment.razorpayPaymentId !== razorpayPaymentId
        ) {
            throw new Error(
                "Payment already fulfilled with another payment ID"
            );
        }


        // Webhook may have fulfilled first.
        // Browser verification may arrive later
        // with checkout signature.

        if (
            razorpaySignature &&
            !payment.razorpaySignature
        ) {

            payment.razorpaySignature =
                razorpaySignature;

            await payment.save({
                session
            });
        }
    }


    // ---------------------------------
    // FIND USER
    // ---------------------------------

    const user = await User.findById(
        payment.userId
    ).session(session);


    if (!user) {
        throw new Error(
            "Associated user not found"
        );
    }


    // If this payment already gave Premium,
    // stop here. Do NOT extend again.

    if (payment.subscriptionApplied) {

        return {
            alreadyApplied: true,
            user
        };
    }


    // ---------------------------------
    // CALCULATE SUBSCRIPTION
    // ---------------------------------

    const now = new Date();

    let startDate;
    let endDate;


    if (
        user.subscription?.endDate &&
        user.subscription.endDate > now
    ) {

        startDate =
            user.subscription.startDate || now;

        endDate =
            new Date(
                user.subscription.endDate
            );

    } else {

        startDate = now;
        endDate = new Date(now);
    }


    if (payment.plan === "monthly") {

        endDate.setMonth(
            endDate.getMonth() + 1
        );

    } else if (payment.plan === "yearly") {

        endDate.setFullYear(
            endDate.getFullYear() + 1
        );

    } else {

        throw new Error(
            "Invalid payment plan"
        );
    }


    // ---------------------------------
    // UPDATE PAYMENT
    // ---------------------------------

    payment.status = "success";

    payment.razorpayPaymentId =
        razorpayPaymentId;


    if (razorpaySignature) {

        payment.razorpaySignature =
            razorpaySignature;
    }


    payment.subscriptionApplied = true;

    payment.fulfilledAt = now;


    // ---------------------------------
    // UPDATE USER
    // ---------------------------------

    user.subscription.plan = "premium";

    user.subscription.startDate =
        startDate;

    user.subscription.endDate =
        endDate;


    // ---------------------------------
    // SAVE
    // ---------------------------------

    await payment.save({
        session
    });

    await user.save({
        session
    });


    return {
        alreadyApplied: false,
        user
    };
}


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

    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
    } = req.body.response || {};


    if (
        !razorpay_payment_id ||
        !razorpay_order_id ||
        !razorpay_signature
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment verification data"
        });
    }


    let session;

    try {

        // 1. FIND OUR PAYMENT RECORD FIRST

        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
            userId: req.user.userId
        });


        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found"
            });
        }


        // 2. VERIFY CHECKOUT SIGNATURE

        // IMPORTANT:
        // use order ID stored in OUR database

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${payment.razorpayOrderId}|${razorpay_payment_id}`
            )
            .digest("hex");


        const generatedBuffer =
            Buffer.from(
                generatedSignature,
                "utf8"
            );

        const receivedBuffer =
            Buffer.from(
                razorpay_signature,
                "utf8"
            );


        const isMatch =
            generatedBuffer.length ===
                receivedBuffer.length &&
            crypto.timingSafeEqual(
                generatedBuffer,
                receivedBuffer
            );


        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Payment signature verification failed"
            });
        }



        // 4. FETCH ACTUAL PAYMENT FROM RAZORPAY

        const razorpayPayment =
            await razorpay.payments.fetch(
                razorpay_payment_id
            );


        // 5. VERIFY PAYMENT DETAILS

        if (
            razorpayPayment.order_id !==
            payment.razorpayOrderId
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment order mismatch"
            });
        }


        if (
            razorpayPayment.amount !==
            payment.amount
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment amount mismatch"
            });
        }


        if (
            razorpayPayment.currency !==
            payment.currency
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment currency mismatch"
            });
        }


        if (
            razorpayPayment.status !==
            "captured"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment has not been captured yet"
            });
        }


        // 6. START DATABASE TRANSACTION

        session =
            await mongoose.startSession();

        session.startTransaction();


        // Fetch payment AGAIN inside transaction
        // so fulfillment works on fresh DB state.

        const transactionPayment =
            await Payment.findById(
                payment._id
            ).session(session);


        if (!transactionPayment) {

            await session.abortTransaction();

            session.endSession();

            return res.status(404).json({
                success: false,
                message: "Payment record not found"
            });
        }


        // 7. APPLY PREMIUM EXACTLY ONCE

        const fulfillment =
            await fulfillPremiumPayment({
                payment:
                    transactionPayment,

                razorpayPaymentId:
                    razorpay_payment_id,

                razorpaySignature:
                    razorpay_signature,

                session
            });


        // 8. COMMIT

        await session.commitTransaction();

        session.endSession();

        session = null;


        const user =
            fulfillment.user;


        // 9. RESPONSE

        return res.status(200).json({
            success: true,

            message:
                fulfillment.alreadyApplied
                    ? "Payment already processed"
                    : "Payment verified successfully",

            data: {
                plan:
                    user.subscription.plan,

                startDate:
                    user.subscription.startDate,

                endDate:
                    user.subscription.endDate
            }
        });


    } catch (error) {

        if (session) {

            try {
                await session.abortTransaction();
            } catch {
                // Transaction may already be closed.
            }

            session.endSession();
        }

        next(error);
    }
}


// -----------------

export async function handleWebhook(req, res, next) {

    let session;

    try {

        // 1. VERIFY WEBHOOK SIGNATURE

        const signature =
            req.headers["x-razorpay-signature"];


        if (!signature || !req.rawBody) {
            return res.status(400).json({
                success: false,
                message: "Invalid webhook request"
            });
        }


        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_WEBHOOK_SECRET
            )
            .update(req.rawBody)
            .digest("hex");


        const generatedBuffer =
            Buffer.from(
                generatedSignature,
                "utf8"
            );

        const receivedBuffer =
            Buffer.from(
                signature,
                "utf8"
            );


        const isMatch =
            generatedBuffer.length ===
                receivedBuffer.length &&
            crypto.timingSafeEqual(
                generatedBuffer,
                receivedBuffer
            );


        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid webhook signature"
            });
        }


        // 2. GET EVENT

        const event = req.body;


        // 3. PAYMENT CAPTURED

        if (event.event === "payment.captured") {

            const razorpayPayment =
                event.payload?.payment?.entity;


            if (
                !razorpayPayment?.id ||
                !razorpayPayment?.order_id
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment webhook payload"
                });
            }


            const payment =
                await Payment.findOne({
                    razorpayOrderId:
                        razorpayPayment.order_id
                });


            if (!payment) {

                // Razorpay may retry non-2xx webhooks.
                // We know this event cannot be fulfilled
                // because it doesn't belong to our DB.

                return res.status(200).json({
                    success: true
                });
            }


            // VERIFY PAYMENT DETAILS

            if (
                razorpayPayment.amount !==
                    payment.amount ||
                razorpayPayment.currency !==
                    payment.currency
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Webhook payment details do not match"
                });
            }


            // 4. TRANSACTION

            session =
                await mongoose.startSession();

            session.startTransaction();


            const transactionPayment =
                await Payment.findById(
                    payment._id
                ).session(session);


            if (!transactionPayment) {

                await session.abortTransaction();
                session.endSession();
                session = null;

                return res.status(200).json({
                    success: true
                });
            }


            // 5. SAME FULFILLMENT AS VERIFY ROUTE

            await fulfillPremiumPayment({

                payment:
                    transactionPayment,

                razorpayPaymentId:
                    razorpayPayment.id,

                session
            });


            await session.commitTransaction();

            session.endSession();

            session = null;
        }


        // 6. PAYMENT FAILED

        else if (
            event.event === "payment.failed"
        ) {

            const razorpayPayment =
                event.payload?.payment?.entity;


            if (razorpayPayment?.order_id) {

                const payment =
                    await Payment.findOne({
                        razorpayOrderId:
                            razorpayPayment.order_id
                    });


                if (
                    payment &&
                    payment.status === "pending" &&
                    !payment.subscriptionApplied
                ) {

                    payment.status = "failed";

                    payment.razorpayPaymentId =
                        razorpayPayment.id;

                    await payment.save();
                }
            }
        }


        // 7. ACKNOWLEDGE WEBHOOK

        return res.status(200).json({
            success: true
        });


    } catch (error) {

        if (session) {

            try {
                await session.abortTransaction();
            } catch {
                // Transaction may already be closed.
            }

            session.endSession();
        }


        next(error);
    }
}