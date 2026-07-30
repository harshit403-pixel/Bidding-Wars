// Importing modules
import express from "express";
import * as PaymentController from "./payment.controller.js";
import { createOrderValidators, verifyPaymentValidators } from "./payment.validator.js";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";
import asyncHandler from "../../../shared/utils/asyncHandler.util.js";

// making the router
const router = express.Router();

// applying auth middleware to all routes
router.use(authMiddleware);

/*
    @route POST /api/payments/create-order
    @desc Create a payment order
    @access Private
*/
router.post("/create-order", createOrderValidators, asyncHandler(PaymentController.createOrder));

/*
    @route POST /api/payments/verify
    @desc Verify a payment
    @access Private
*/
router.post("/verify", verifyPaymentValidators, asyncHandler(PaymentController.verifyPayment));

/*
    @route GET /api/payments/:auctionId
    @desc Get payment details for an auction
    @access Private
*/
router.get("/:auctionId", asyncHandler(PaymentController.getPayment));

// exporting the router
export default router;
