// importing modules
import express from "express";
import privateAuctionRouter from "../../modules/private/auction/auction.router.js";
import publicAuctionRouter from "../../modules/public/auction/auction.router.js";

// making the router
const router = express.Router();

// auction router
router.use("/", publicAuctionRouter);
router.use("/", privateAuctionRouter);

export default router;