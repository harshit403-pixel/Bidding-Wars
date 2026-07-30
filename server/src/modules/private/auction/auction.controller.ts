// Importing modules
import { Response } from "express";
import crypto from "crypto";

import AuctionDAO from "../../../shared/dao/auction.dao.js";
import { AuthenticatedRequest } from "../../public/auth/auth.types.js";

import Created from "../../../shared/responses/Created.response.js";
import Ok from "../../../shared/responses/Ok.response.js";
import NotFound from "../../../shared/errors/NotFound.error.js";
import BadRequest from "../../../shared/errors/BadRequest.error.js";
import Forbidden from "../../../shared/errors/Forbidden.error.js";

const auctionDAO = new AuctionDAO();

// Create a new auction
export const createAuction = async (req: AuthenticatedRequest, res: Response) => {

    // getting the authenticated user
    const user = req.user!;

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

    // generating a unique room id for socket connections
    const roomId = crypto.randomUUID();

    // determining initial status based on start time
    const now = new Date();
    const status = new Date(startsAt) > now ? "upcoming" : "active";

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
    const existingAuction = await auctionDAO.findAuctionByIdLean(
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
        req.params.auctionId as string,
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
    const existingAuction = await auctionDAO.findAuctionByIdLean(
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

    // checking if auction can be deleted
    if (existingAuction.status === "active" || existingAuction.status === "ended") {
        throw new BadRequest("Cannot delete an active or ended auction");
    }

    // deleting the auction
    await auctionDAO.deleteAuctionById(req.params.auctionId as string);

    // returning the response
    return Ok(res, "Auction deleted successfully");
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
