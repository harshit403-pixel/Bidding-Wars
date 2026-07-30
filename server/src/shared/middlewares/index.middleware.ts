// Importing modules
import express, { Express } from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import env from "../config/env.config.js";

// function to apply middlewares to the app
function applyMiddlewares(app: Express) {

    // applying middlewares
    app.use(compression());

    app.use(cors({
        origin: env.FRONTEND_URL,
        credentials: true,
    }));

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: [
                        "'self'",
                        "'unsafe-inline'",
                        "'unsafe-eval'",
                        "https://checkout.razorpay.com",
                    ],
                    connectSrc: [
                        "'self'",
                        "https://upload.imagekit.io",
                        "https://*.imagekit.io",
                        "https://api.razorpay.com",
                        "https://*.razorpay.com",
                        "wss:",
                        "ws:",
                    ],
                    imgSrc: [
                        "'self'",
                        "data:",
                        "blob:",
                        "https://ik.imagekit.io",
                        "https://*.imagekit.io",
                        "https://*.razorpay.com",
                    ],
                    frameSrc: ["'self'", "https://api.razorpay.com"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                    fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
                    objectSrc: ["'none'"],
                },
            },
            crossOriginResourcePolicy: { policy: "cross-origin" },
            crossOriginEmbedderPolicy: false,
        })
    );

    app.use(cookieParser());

    app.use(express.json({ limit: "100kb" }));

    app.use(express.urlencoded({ extended: true, limit: "100kb" }));

}

export default applyMiddlewares;
