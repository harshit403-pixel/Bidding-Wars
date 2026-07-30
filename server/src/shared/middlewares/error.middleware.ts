// Importing modules
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.config.js";

// function to handle errors in the application
function errorHandler(err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || 500;

    if (statusCode === 401 || statusCode === 404) {
        logger.warn({ statusCode, message: err.message, path: req.path }, err.message);
    } else {
        logger.error(err);
    }

    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || "Internal Server Error"
    });
}

export default errorHandler;
