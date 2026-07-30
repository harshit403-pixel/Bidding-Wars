import { Response } from "express";

import AuctionDAO from "../../../shared/dao/auction.dao.js";
import { createAuctionSchema, updateAuctionSchema } from "./auction.validator.js";
import { AuthenticatedRequest } from "../auth/auth.types.js";

import Ok from "../../../shared/responses/Ok.response.js";
import NotFoundError from "../../../shared/errors/NotFound.error.js";
import User from "../../../shared/models/user.model.js";
import BadRequest from "../../../shared/errors/BadRequest.error.js";

const auctionDAO = new AuctionDAO();

export const createAuction = async (req: AuthenticatedRequest, res: Response) => {
    const data = createAuctionSchema.parse(req.body);

    const user = req.user!;

    const auction = await auctionDAO.createAuction({
        ...data,
        seller: user.userId!,
        currentPrice: data.startingBid,
    });

    await User.findByIdAndUpdate(user.userId!, {
        $push: {
            auctionsCreated: auction._id,
        },
    });

    return Ok(res, "Auction created successfully", { auction });
};

export const getAuctions = async (req: AuthenticatedRequest, res: Response) => {
    const { page = "1", limit = "10", status, category, search } = req.query;

    const filter: Record<string, unknown> = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    if (search) {
        filter.title = {
            $regex: search,
            $options: "i",
        };
    }

    const result = await auctionDAO.findAuctions(filter, {
        page: Number(page),
        limit: Number(limit),
    });

    return Ok(res, "Auctions fetched successfully", {
        auctions: result.auctions,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
    });
};

export const getAuction = async (req: AuthenticatedRequest, res: Response) => {
    const auction = await auctionDAO.findAuctionById(req.params.auctionId as string);

    if (!auction) {
        throw new NotFoundError("Auction not found");
    }

    return Ok(res, "Auction fetched successfully", {
        auction,
    });
};

export const updateAuction = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;

    const existingAuction = await auctionDAO.findAuctionByIdLean(
        req.params.auctionId as string,
    );

    if (!existingAuction) {
        throw new NotFoundError("Auction not found");
    }

    if (existingAuction.seller.toString() !== user.userId!) {
        throw new BadRequest("You can only update your own auction");
    }

    const data = updateAuctionSchema.parse(req.body);

    const auction = await auctionDAO.updateAuctionById(
        req.params.auctionId as string,
        data,
    );

    return Ok(res, "Auction updated successfully", {
        auction,
    });
};

export const deleteAuction = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;

    const existingAuction = await auctionDAO.findAuctionByIdLean(
        req.params.auctionId as string,
    );

    if (!existingAuction) {
        throw new NotFoundError("Auction not found");
    }

    if (existingAuction.seller.toString() !== user.userId!) {
        throw new BadRequest("You can only delete your own auction");
    }

    await auctionDAO.deleteAuctionById(req.params.auctionId as string);

    return Ok(res, "Auction deleted successfully");
};

export const getMyAuctions = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;

    const { page = "1", limit = "10" } = req.query;

    const result = await auctionDAO.findAuctionsBySeller(
        user.userId!,
        {
            page: Number(page),
            limit: Number(limit),
        },
    );

    return Ok(res, "My auctions fetched successfully", {
        auctions: result.auctions,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
    });
};