// Importing modules
import express from "express";
import healthRouter from "./health.router.js";
import authRouter from "../../modules/public/auth/auth.router.js";
import auctionRouter from "../../modules/public/auction/auction.router.js";
import profileRouter from "../../modules/public/profile/profile.router.js";
import uploadRouter from "../../modules/public/upload/upload.router.js";
import dashboardRouter from "../../modules/public/dashboard/dashboard.router.js";

// making the router
const router = express.Router();

// mounting the public routers
router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/auctions", auctionRouter);
router.use("/profile", profileRouter);
router.use("/upload", uploadRouter);
router.use("/dashboard", dashboardRouter);



// exporting the router
export default router;
