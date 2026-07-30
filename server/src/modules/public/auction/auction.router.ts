// Importing modules
import express from "express";
import * as AuctionController from "./auction.controller.js";
import { auctionIdParamValidators } from "./auction.validator.js";
import asyncHandler from "../../../shared/utils/asyncHandler.util.js";

// making the router
const router = express.Router();

/*
    @route GET /api/auctions
    @desc Get all auctions (public listing)
    @access Public
*/
router.get("/", asyncHandler(AuctionController.getAuctions));

/*
    @route GET /api/auctions/:auctionId
    @desc Get auction by ID
    @access Public
*/
router.get("/:auctionId", auctionIdParamValidators, asyncHandler(AuctionController.getAuction));

/*
    @route GET /api/auctions/:auctionId/bids
    @desc Get bids for an auction
    @access Public
*/
router.get("/:auctionId/bids", auctionIdParamValidators, asyncHandler(AuctionController.getAuctionBids));

/*
    @route GET /api/auctions/:auctionId/timeline
    @desc Get timeline for an auction
    @access Public
*/
router.get("/:auctionId/timeline", auctionIdParamValidators, asyncHandler(AuctionController.getAuctionTimeline));

/*
    @route GET /api/auctions/:auctionId/messages
    @desc Get messages for an auction
    @access Public
*/
router.get("/:auctionId/messages", auctionIdParamValidators, asyncHandler(AuctionController.getAuctionMessages));

// exporting the router
export default router;
