import { Request, Response } from "express";

import Auction from "../../../shared/models/auction.model.js";
import Ok from "../../../shared/responses/Ok.response.js";

export const getDashboard = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const [
        totalAuctions,
        draftAuctions,
        activeAuctions,
        endedAuctions,
        cancelledAuctions,
        auctionsWon,
    ] = await Promise.all([
        Auction.countDocuments({ seller: user.userId }),

        Auction.countDocuments({
            seller: user.userId,
            status: "draft",
        }),

        Auction.countDocuments({
            seller: user.userId,
            status: "active",
        }),

        Auction.countDocuments({
            seller: user.userId,
            status: "ended",
        }),

        Auction.countDocuments({
            seller: user.userId,
            status: "cancelled",
        }),

        Auction.countDocuments({
            winner: user.userId,
        }),
    ]);

    return Ok(res, "Dashboard fetched successfully", {
        totalAuctions,
        draftAuctions,
        activeAuctions,
        endedAuctions,
        cancelledAuctions,
        auctionsWon,
    });
};