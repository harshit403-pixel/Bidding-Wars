import cron from "node-cron";

import Auction from "../models/auction.model.js";

export const startAuctionStatusJob = () => {
    cron.schedule("* * * * *", async () => {
        const now = new Date();

        await Auction.updateMany(
            {
                status: "draft",
                startsAt: { $lte: now },
            },
            {
                $set: {
                    status: "active",
                },
            },
        );

        await Auction.updateMany(
            {
                status: "active",
                endsAt: { $lte: now },
            },
            {
                $set: {
                    status: "ended",
                },
            },
        );
    });

    console.log("Auction status scheduler started.");
};