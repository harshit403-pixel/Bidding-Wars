import { Request, Response } from "express";

import User from "../../../shared/models/user.model.js";

import Ok from "../../../shared/responses/Ok.response.js";
import NotFoundError from "../../../shared/errors/NotFound.error.js";
import Auction from "../../../shared/models/auction.model.js";

import { updateProfileSchema } from "./profile.validator.js";

export const getMyProfile = async (req: Request, res: Response) => {
    const userData = (req as any).user;

    const user = await User.findById(userData.userId)
        .populate("auctionsCreated")
        .populate("auctionsWon")
        .populate("wishlist")
        .select("-password -googleId");

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return Ok(res, "Profile fetched successfully", { user });
};

export const updateProfile = async (req: Request, res: Response) => {
    const userData = (req as any).user;

    const data = updateProfileSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
        userData.userId,
        data,
        {
            new: true,
            runValidators: true,
        },
    ).select("-password -googleId");

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return Ok(res, "Profile updated successfully", { user });
};

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.params.userId as string;

    const user = await User.findById(userId)
        .select("-password -googleId");

    if (!user) {
        throw new NotFoundError("User not found");
    }

    const [
        totalAuctions,
        activeAuctions,
        endedAuctions,
    ] = await Promise.all([
        Auction.countDocuments({
            seller: userId,
        }),

        Auction.countDocuments({
            seller: userId,
            status: "active",
        }),

        Auction.countDocuments({
            seller: userId,
            status: "ended",
        }),
    ]);

    return Ok(res, "User profile fetched successfully", {
        user,
        stats: {
            totalAuctions,
            activeAuctions,
            endedAuctions,
            rating: user.rating,
            totalReviews: user.totalReviews,
        },
    });
};