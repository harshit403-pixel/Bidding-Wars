// Importing modules
import express from "express";
import * as DashboardController from "./dashboard.controller.js";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";
import asyncHandler from "../../../shared/utils/asyncHandler.util.js";

// making the router
const router = express.Router();

// applying auth middleware to all routes
router.use(authMiddleware);

/*
    @route GET /api/dashboard
    @desc Get dashboard statistics
    @access Private
*/
router.get("/", asyncHandler(DashboardController.getDashboard));

// exporting the router
export default router;
