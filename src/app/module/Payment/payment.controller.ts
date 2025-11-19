import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import httpstatus from 'http-status'
import { PaymentService } from "./payment.service";
import { stripe } from "../../helpers/stripe";
import { envVars } from "../../config/envVars";


const stripeWebhookHandler =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
 const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = envVars.STRIPE_WEBHOOK_SCRECT

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    const result = await PaymentService.StripeWebhookService(event);
   sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: 'Webhook req send successfully',
        data: result,
    });
})


export const paymentController={
    stripeWebhookHandler
}