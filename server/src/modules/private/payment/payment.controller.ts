// Importing modules
import crypto from "crypto";
import { Response } from "express";
import mongoose from "mongoose";

import AuctionDAO from "../../../shared/dao/auction.dao.js";
import PaymentDAO from "../../../shared/dao/payment.dao.js";
import { AuthenticatedRequest } from "../../public/auth/auth.types.js";
import env from "../../../shared/config/env.config.js";

import Created from "../../../shared/responses/Created.response.js";
import Ok from "../../../shared/responses/Ok.response.js";
import NotFound from "../../../shared/errors/NotFound.error.js";
import BadRequest from "../../../shared/errors/BadRequest.error.js";
import Forbidden from "../../../shared/errors/Forbidden.error.js";

const auctionDAO = new AuctionDAO();
const paymentDAO = new PaymentDAO();

// Create a payment order
export const createOrder = async (req: AuthenticatedRequest, res: Response) => {

    // getting the authenticated user
    const user = req.user!;

    // getting the auction id from request body
    const { auctionId } = req.body;

    // finding the auction by Mongo _id or roomId UUID
    let auction = mongoose.Types.ObjectId.isValid(auctionId)
        ? await auctionDAO.findAuctionByIdLean(auctionId)
        : null;
    if (!auction) {
        auction = await auctionDAO.findAuctionByRoomId(auctionId);
    }

    // checking if auction exists
    if (!auction) {
        throw new NotFound("Auction not found");
    }

    // checking if auction has ended
    if (auction.status !== "ended") {
        throw new BadRequest("Auction has not ended yet");
    }

    // checking if auction has a winner
    if (!auction.winner) {
        throw new BadRequest("No winner for this auction");
    }

    // checking if the user is the winner
    if (auction.winner.toString() !== user.userId!) {
        throw new Forbidden("Only the winner can create a payment order");
    }

    // checking if payment already exists
    let payment = await paymentDAO.findPaymentByAuction(auction._id.toString());

    if (!payment) {
        // creating the payment record
        payment = await paymentDAO.createPayment({
            auction: auction._id.toString(),
            winner: user.userId!,
            amount: auction.currentPrice,
            provider: "razorpay",
            status: "pending",
        });
    }

    // returning the response
    return Created(res, "Payment order created successfully", {
        payment,
        amount: auction.currentPrice,
    });
};

// Verify a payment
export const verifyPayment = async (req: AuthenticatedRequest, res: Response) => {

    // getting the request body
    const { providerOrderId, providerPaymentId, providerSignature } = req.body;

    // finding the payment by provider order id
    const payment = await paymentDAO.findPaymentByProviderOrderId(providerOrderId);

    // checking if payment exists
    if (!payment) {
        throw new NotFound("Payment not found");
    }

    // checking if payment is already verified
    if (payment.status === "paid") {
        throw new BadRequest("Payment already verified");
    }

    // Verify Razorpay signature using HMAC-SHA256
    if (env.RAZORPAY_KEY_SECRET) {
        const expectedSignature = crypto
            .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
            .update(`${providerOrderId}|${providerPaymentId}`)
            .digest("hex");

        if (expectedSignature !== providerSignature) {
            throw new BadRequest("Invalid payment signature");
        }
    }

    // updating the payment
    const updatedPayment = await paymentDAO.updatePaymentVerification(providerOrderId, {
        providerPaymentId,
        providerSignature,
        status: "paid",
        paidAt: new Date(),
    });

    // updating the auction payment status
    await auctionDAO.updatePaymentStatus(payment.auction.toString(), "paid");

    // returning the response
    return Ok(res, "Payment verified successfully", {
        payment: updatedPayment,
    });
};

// Get payment details for an auction
export const getPayment = async (req: AuthenticatedRequest, res: Response) => {

    // finding the payment
    const payment = await paymentDAO.findPaymentByAuction(req.params.auctionId as string);

    // checking if payment exists
    if (!payment) {
        throw new NotFound("Payment not found");
    }

    // returning the response
    return Ok(res, "Payment fetched successfully", {
        payment,
    });
};
