// Importing modules
import express from "express";
import healthRouter from "./health.router.js";
import authRouter from "../../modules/public/auth/auth.router.js";
import auctionRouter from "./auction.router.js";
import uploadRouter from "../../modules/public/upload/upload.router.js";

// making the router
const router = express.Router();

// mounting the public routers
router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/upload", uploadRouter);
router.use("/auctions", auctionRouter);


// exporting the router
export default router;
