// Importing modules
import { Response } from "express";

import AuctionDAO from "../../../shared/dao/auction.dao.js";
import { AuthenticatedRequest } from "../auth/auth.types.js";

import Ok from "../../../shared/responses/Ok.response.js";
import NotFound from "../../../shared/errors/NotFound.error.js";

const auctionDAO = new AuctionDAO();

// Get all auctions (public listing)
export const getAuctions = async (req: AuthenticatedRequest, res: Response) => {

    // getting query params
    const { page = "1", limit = "10", status, category, seller, search, sort } = req.query;

    // building the filter
    const filter: Record<string, unknown> = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (seller) filter.seller = seller;

    if (search) {
        filter.title = {
            $regex: search,
            $options: "i",
        };
    }

    // building the sort object
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };

    if (sort) {
        if (sort === "endingSoon") {
            sortObj = { endTime: 1 };
        } else if (sort === "-createdAt") {
            sortObj = { createdAt: -1 };
        } else if (sort === "currentPrice") {
            sortObj = { currentPrice: 1 };
        } else if (sort === "-currentPrice") {
            sortObj = { currentPrice: -1 };
        } else if (sort === "-endTime") {
            sortObj = { endTime: -1 };
        }
    }

    // finding auctions
    const result = await auctionDAO.findAuctions(filter, {
        page: Number(page),
        limit: Number(limit),
        sort: sortObj,
    });

    // returning the response
    return Ok(res, "Auctions fetched successfully", {
        auctions: result.auctions,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
    });
};

// Get auction by ID
export const getAuction = async (req: AuthenticatedRequest, res: Response) => {

    // finding the auction
    const auction = await auctionDAO.findAuctionById(req.params.auctionId as string);

    // checking if auction exists
    if (!auction) {
        throw new NotFound("Auction not found");
    }

    // returning the response
    return Ok(res, "Auction fetched successfully", {
        auction,
    });
};

// Get bids for an auction
export const getAuctionBids = async (req: AuthenticatedRequest, res: Response) => {

    // importing bid dao
    const BidDAO = (await import("../../../shared/dao/bid.dao.js")).default;
    const bidDAO = new BidDAO();

    // getting query params
    const { page = "1", limit = "20" } = req.query;

    // finding bids
    const result = await bidDAO.findBidsByAuction(req.params.auctionId as string, {
        page: Number(page),
        limit: Number(limit),
    });

    // returning the response
    return Ok(res, "Bids fetched successfully", {
        bids: result.bids,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
    });
};

// Get timeline for an auction
export const getAuctionTimeline = async (req: AuthenticatedRequest, res: Response) => {

    // importing timeline dao
    const TimelineDAO = (await import("../../../shared/dao/timeline.dao.js")).default;
    const timelineDAO = new TimelineDAO();

    // getting query params
    const { page = "1", limit = "50" } = req.query;

    // finding events
    const result = await timelineDAO.findEventsByAuction(req.params.auctionId as string, {
        page: Number(page),
        limit: Number(limit),
    });

    // returning the response
    return Ok(res, "Timeline fetched successfully", {
        events: result.events,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
    });
};

// Get messages for an auction
export const getAuctionMessages = async (req: AuthenticatedRequest, res: Response) => {

    // importing chat message dao
    const ChatMessageDAO = (await import("../../../shared/dao/chatMessage.dao.js")).default;
    const chatMessageDAO = new ChatMessageDAO();

    // getting query params
    const { page = "1", limit = "50" } = req.query;

    // finding messages
    const result = await chatMessageDAO.findMessagesByAuction(req.params.auctionId as string, {
        page: Number(page),
        limit: Number(limit),
    });

    // returning the response
    return Ok(res, "Messages fetched successfully", {
        messages: result.messages,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
    });
};
