// Importing modules
import { Response } from "express";

import AuctionDAO from "../../../shared/dao/auction.dao.js";
import BidDAO from "../../../shared/dao/bid.dao.js";
import { AuthenticatedRequest } from "../../public/auth/auth.types.js";

import Ok from "../../../shared/responses/Ok.response.js";

const auctionDAO = new AuctionDAO();
const bidDAO = new BidDAO();

// Get dashboard statistics
export const getDashboard = async (req: AuthenticatedRequest, res: Response) => {

    // getting the authenticated user
    const user = req.user!;

    // running parallel queries for dashboard stats
    const [auctionStats, totalBids] = await Promise.all([
        auctionDAO.getDashboardStats(user.userId!),
        bidDAO.countBidsByUser(user.userId!),
    ]);

    // returning the response
    return Ok(res, "Dashboard fetched successfully", {
        ...auctionStats,
        totalBids,
    });
};
