import { Request, Response } from "express";

import * as AuctionDAO from "../../../shared/dao/auction.dao.js";
import { createAuctionSchema, updateAuctionSchema } from "./auction.validator.js";

import Ok from "../../../shared/responses/Ok.response.js";
import NotFoundError from "../../../shared/errors/NotFound.error.js";
import User from "../../../shared/models/user.model.js";
import BadRequest from "../../../shared/errors/BadRequest.error.js";


export const createAuction = async (req: Request, res: Response) => {
    const data = createAuctionSchema.parse(req.body);

    const user = (req as any).user;

    const auction = await AuctionDAO.createAuction({
        ...data,
        seller: user.userId,
        currentBid: data.startingBid,
    });

    await User.findByIdAndUpdate(user.userId, {
        $push: {
            auctionsCreated: auction._id,
        },
    });

    return Ok(res, "Auction created successfully", { auction });
};

export const getAuctions = async (req: Request, res: Response) => {
    const { page = "1", limit = "10", status, category, search } = req.query;

    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    if (search) {
        filter.title = {
            $regex: search,
            $options: "i",
        };
    }

    const auctions = await AuctionDAO.getAuctions(filter, {
        page: Number(page),
        limit: Number(limit),
    });

    const total = await AuctionDAO.countAuctions(filter);

    return Ok(res, "Auctions fetched successfully", {
        auctions,
        total,
    });
};

export const getAuction = async (req: Request, res: Response) => {
    const auction = await AuctionDAO.getAuctionById(req.params.auctionId as string);

    if (!auction) {
        throw new NotFoundError("Auction not found");
    }

    return Ok(res, "Auction fetched successfully", {
        auction,
    });
};

export const updateAuction = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const existingAuction = await AuctionDAO.getAuctionByIdWithoutPopulate(
        req.params.auctionId as string,
    );

    if (!existingAuction) {
        throw new NotFoundError("Auction not found");
    }

    if (existingAuction.seller.toString() !== user.userId) {
        throw new BadRequest("You can only update your own auction");
    }

    const data = updateAuctionSchema.parse(req.body);

    const auction = await AuctionDAO.updateAuction(
        req.params.auctionId as string,
        data,
    );

    return Ok(res, "Auction updated successfully", {
        auction,
    });
};

export const deleteAuction = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const existingAuction = await AuctionDAO.getAuctionByIdWithoutPopulate(
        req.params.auctionId as string,
    );

    if (!existingAuction) {
        throw new NotFoundError("Auction not found");
    }

    if (existingAuction.seller.toString() !== user.userId) {
        throw new BadRequest("You can only delete your own auction");
    }

    await AuctionDAO.deleteAuction(req.params.auctionId as string);

    return Ok(res, "Auction deleted successfully");
};

export const getMyAuctions = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const { page = "1", limit = "10" } = req.query;

    const auctions = await AuctionDAO.getMyAuctions(
        user.userId,
        {
            page: Number(page),
            limit: Number(limit),
        },
    );

    return Ok(res, "My auctions fetched successfully", {
        auctions,
    });
};