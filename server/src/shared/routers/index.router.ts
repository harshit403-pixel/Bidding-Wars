// Importing modules
import express from "express";
import healthRouter from "./health.router.js";
import authRouter from "../../modules/public/auth/auth.router.js";
import auctionRouter from "../../modules/public/auction/auction.router.js";
import privateAuctionRouter from "../../modules/private/auction/auction.router.js";
import dashboardRouter from "../../modules/private/dashboard/dashboard.router.js";
import uploadRouter from "../../modules/public/upload/upload.router.js";

// making the router
const router = express.Router();

// mounting the public routers
router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/upload", uploadRouter);
router.use("/auctions", auctionRouter);
router.use("/auctions", privateAuctionRouter);
router.use("/dashboard", dashboardRouter);

// exporting the router
export default router;
