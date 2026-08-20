// Importing modules
import { Response } from "express";
import crypto from "crypto";
import mongoose from "mongoose";

import AuctionDAO from "../../../shared/dao/auction.dao.js";
import BidDAO from "../../../shared/dao/bid.dao.js";
import TimelineDAO from "../../../shared/dao/timeline.dao.js";
import ChatMessageDAO from "../../../shared/dao/chatMessage.dao.js";
import UserDao from "../../../shared/dao/user.dao.js";
import socketManager from "../../../shared/socket/socket.manager.js";
import { AuthenticatedRequest } from "../../public/auth/auth.types.js";

import Created from "../../../shared/responses/Created.response.js";
import Ok from "../../../shared/responses/Ok.response.js";
import NotFound from "../../../shared/errors/NotFound.error.js";
import BadRequest from "../../../shared/errors/BadRequest.error.js";
import Forbidden from "../../../shared/errors/Forbidden.error.js";

const auctionDAO = new AuctionDAO();
const bidDAO = new BidDAO();
const timelineDAO = new TimelineDAO();
const chatMessageDAO = new ChatMessageDAO();
const userDao = new UserDao();

const getAuctionByIdOrRoomId = async (id: string) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const auction = await auctionDAO.findAuctionByIdLean(id);
        if (auction) return auction;
    }
    return await auctionDAO.findAuctionByRoomId(id);
};

// Create a new auction
export const createAuction = async (req: AuthenticatedRequest, res: Response) => {

    // getting the authenticated user
    const user = req.user!;

    // checking if user is verified
    const dbUser = await userDao.findUserById(user.userId as string);
    if (!dbUser || !dbUser.isVerified) {
        throw new Forbidden("Your account is not verified. Please verify your email before creating an auction.");
    }

    // getting the request body
    const {
        title,
        description,
        category,
        condition,
        images,
        startingBid,
        minimumIncrement,
        startsAt,
        endsAt,
    } = req.body;

    // validating end time is after start time
    if (new Date(endsAt) <= new Date(startsAt)) {
        throw new BadRequest("End time must be after start time");
    }

    // warning: start time in the past means auction starts immediately
    const startsInPast = new Date(startsAt) < new Date();

    // generating a unique room id for socket connections
    const roomId = crypto.randomUUID();

    // determining initial status based on start time (with 60s leeway for immediate activation)
    const now = new Date();
    const status = new Date(startsAt).getTime() > now.getTime() + 60000 ? "upcoming" : "active";

    // creating the auction document
    const auction = await auctionDAO.createAuction({
        title,
        description,
        category,
        condition,
        images,
        startingPrice: startingBid,
        currentPrice: startingBid,
        minimumIncrement: minimumIncrement || 1,
        seller: user.userId!,
        roomId,
        status,
        startTime: startsAt,
        endTime: endsAt,
    });

    // returning the response
    return Created(res, "Auction created successfully", { auction });
};

// Update an auction
export const updateAuction = async (req: AuthenticatedRequest, res: Response) => {

    // getting the authenticated user
    const user = req.user!;

    // finding the existing auction
    const existingAuction = await getAuctionByIdOrRoomId(
        req.params.auctionId as string,
    );

    // checking if auction exists
    if (!existingAuction) {
        throw new NotFound("Auction not found");
    }

    // checking if the user is the seller
    if (existingAuction.seller.toString() !== user.userId!) {
        throw new Forbidden("You can only update your own auction");
    }

    // checking if auction can be updated
    if (existingAuction.status !== "upcoming") {
        throw new BadRequest("Cannot update auction after it has started");
    }

    // getting the request body
    const {
        title,
        description,
        category,
        condition,
        images,
        startingBid,
        minimumIncrement,
        startsAt,
        endsAt,
    } = req.body;

    // building update object
    const updateData: Record<string, unknown> = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (condition) updateData.condition = condition;
    if (images) updateData.images = images;
    if (startingBid) {
        updateData.startingPrice = startingBid;
        updateData.currentPrice = startingBid;
    }
    if (minimumIncrement) updateData.minimumIncrement = minimumIncrement;
    if (startsAt) updateData.startTime = startsAt;
    if (endsAt) updateData.endTime = endsAt;

    // validating end time is after start time if both are provided
    if (startsAt && endsAt) {
        if (new Date(endsAt) <= new Date(startsAt)) {
            throw new BadRequest("End time must be after start time");
        }
    }

    // updating the auction
    const auction = await auctionDAO.updateAuctionById(
        existingAuction._id.toString(),
        updateData,
    );

    // returning the response
    return Ok(res, "Auction updated successfully", {
        auction,
    });
};

// Delete an auction
export const deleteAuction = async (req: AuthenticatedRequest, res: Response) => {

    // getting the authenticated user
    const user = req.user!;

    // finding the existing auction
    const existingAuction = await getAuctionByIdOrRoomId(
        req.params.auctionId as string,
    );

    // checking if auction exists
    if (!existingAuction) {
        throw new NotFound("Auction not found");
    }

    // checking if the user is the seller
    if (existingAuction.seller.toString() !== user.userId!) {
        throw new Forbidden("You can only delete your own auction");
    }

    // checking if auction can be deleted (cannot delete after it has ended)
    if (existingAuction.status === "ended") {
        throw new BadRequest("Cannot delete an auction after it has ended");
    }

    // if active/room exists, notify connected sockets and cleanup room
    if (existingAuction.roomId) {
        socketManager.broadcastToRoom(existingAuction.roomId, "auction_ended", {
            auction: {
                ...existingAuction,
                status: "ended",
            },
        });
        socketManager.deleteRoom(existingAuction.roomId);
    }

    // cascade deleting associated data
    await bidDAO.deleteBidsByAuction(existingAuction._id.toString());
    await timelineDAO.deleteEventsByAuction(existingAuction._id.toString());
    await chatMessageDAO.deleteMessagesByAuction(existingAuction._id.toString());

    // deleting the auction
    await auctionDAO.deleteAuctionById(existingAuction._id.toString());

    // returning the response
    return Ok(res, "Auction deleted successfully");
};

// Start auction immediately
export const startNow = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;

    const existingAuction = await getAuctionByIdOrRoomId(
        req.params.auctionId as string,
    );

    if (!existingAuction) {
        throw new NotFound("Auction not found");
    }

    if (existingAuction.seller.toString() !== user.userId!) {
        throw new Forbidden("You can only update your own auction");
    }

    if (existingAuction.status === "active") {
        const fullAuction = await auctionDAO.findAuctionByIdLean(existingAuction._id.toString());
        return Ok(res, "Auction is already active", { auction: fullAuction });
    }

    const auction = await auctionDAO.updateAuctionById(
        existingAuction._id.toString(),
        {
            status: "active",
            startTime: new Date(),
        },
    );

    const updatedAuction = await auctionDAO.findAuctionByIdLean(existingAuction._id.toString());

    // emit socket event for realtime
    try {
        const { getIO } = await import("../../../shared/socket/socket.js");
        const socketManager = (await import("../../../shared/socket/socket.manager.js")).default;
        if (existingAuction.roomId) {
            const room = socketManager.getRoom(existingAuction.roomId);
            if (room) {
                room.status = "active";
            }
        }
        const io = getIO();
        if (io && existingAuction.roomId) {
            io.to(existingAuction.roomId).emit("auction_started", {
                auction: updatedAuction!,
            });
        }
    } catch {
        // socket not available
    }

    return Ok(res, "Auction started successfully", { auction: updatedAuction });
};

// End auction immediately
export const endNow = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;

    const existingAuction = await getAuctionByIdOrRoomId(
        req.params.auctionId as string,
    );

    if (!existingAuction) {
        throw new NotFound("Auction not found");
    }

    if (existingAuction.seller.toString() !== user.userId!) {
        throw new Forbidden("You can only update your own auction");
    }

    if (existingAuction.status === "ended") {
        const fullAuction = await auctionDAO.findAuctionByIdLean(existingAuction._id.toString());
        return Ok(res, "Auction is already ended", { auction: fullAuction });
    }

    // find highest bid
    const highestBid = await bidDAO.findHighestBid(existingAuction._id.toString());

    const updateData: Record<string, unknown> = {
        status: "ended",
        endedAt: new Date(),
    };

    if (highestBid) {
        updateData.winner = highestBid.bidder;
        updateData.currentPrice = highestBid.amount;
    }

    await auctionDAO.updateAuctionById(
        existingAuction._id.toString(),
        updateData,
    );

    // mark winning bid
    if (highestBid) {
        await bidDAO.markWinningBid(highestBid._id.toString());
    }

    const updatedAuction = await auctionDAO.findAuctionByIdLean(existingAuction._id.toString());

    // emit socket event for realtime
    try {
        const { getIO } = await import("../../../shared/socket/socket.js");
        const socketManager = (await import("../../../shared/socket/socket.manager.js")).default;
        if (existingAuction.roomId) {
            const room = socketManager.getRoom(existingAuction.roomId);
            if (room) {
                room.status = "ended";
            }
        }
        const io = getIO();
        if (io && existingAuction.roomId) {
            io.to(existingAuction.roomId).emit("auction_ended", {
                auction: updatedAuction!,
            });
        }
    } catch {
        // socket not available
    }

    return Ok(res, "Auction ended successfully", { auction: updatedAuction });
};

// Get auctions created by the logged-in seller
export const getMyAuctions = async (req: AuthenticatedRequest, res: Response) => {

    // getting the authenticated user
    const user = req.user!;

    // getting pagination params
    const { page = "1", limit = "10", status } = req.query;

    // building the filter
    const filter: Record<string, unknown> = {
        seller: user.userId!,
    };

    if (status) {
        filter.status = status;
    }

    // finding auctions
    const result = await auctionDAO.findAuctions(filter, {
        page: Number(page),
        limit: Number(limit),
    });

    // returning the response
    return Ok(res, "My auctions fetched successfully", {
        auctions: result.auctions,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
    });
};
