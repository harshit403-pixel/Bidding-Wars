// Importing modules
import express from "express";
import * as AuctionController from "./auction.controller.js";
import { createAuctionValidators, updateAuctionValidators } from "./auction.validator.js";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";
import asyncHandler from "../../../shared/utils/asyncHandler.util.js";

// making the router
const router = express.Router();

// applying auth middleware to all routes
router.use(authMiddleware);

/*
    @route POST /api/auctions
    @desc Create a new auction
    @access Private
*/
router.post("/", createAuctionValidators, asyncHandler(AuctionController.createAuction));

/*
    @route PATCH /api/auctions/:auctionId
    @desc Update an auction
    @access Private
*/
router.patch("/:auctionId", updateAuctionValidators, asyncHandler(AuctionController.updateAuction));

/*
    @route DELETE /api/auctions/:auctionId
    @desc Delete an auction
    @access Private
*/
router.delete("/:auctionId", asyncHandler(AuctionController.deleteAuction));

/*
    @route GET /api/auctions/my
    @desc Get auctions created by logged-in seller
    @access Private
*/
router.get("/my", asyncHandler(AuctionController.getMyAuctions));

// exporting the router
export default router;
