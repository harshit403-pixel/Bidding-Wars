import Auction from "../models/auction.model.js";

export const createAuction = async (data: any) => {
    return await Auction.create(data);
};

export const getAuctionById = async (auctionId: string) => {
    return await Auction.findById(auctionId)
        .populate("seller", "name email avatar rating")
        .populate("highestBidder", "name avatar")
        .populate("winner", "name avatar");
};

export const getAuctions = async (filter: any, options: any = {}) => {
    const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
    } = options;

    return await Auction.find(filter)
        .populate("seller", "name avatar rating")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
};

export const updateAuction = async (
    auctionId: string,
    data: any,
) => {
    return await Auction.findByIdAndUpdate(
        auctionId,
        data,
        {
            new: true,
            runValidators: true,
        },
    );
};

export const deleteAuction = async (auctionId: string) => {
    return await Auction.findByIdAndDelete(auctionId);
};

export const countAuctions = async (filter: any) => {
    return await Auction.countDocuments(filter);
};

export const getMyAuctions = async (
    sellerId: string,
    options: any = {},
) => {
    const {
        page = 1,
        limit = 10,
    } = options;

    return await Auction.find({ seller: sellerId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
};

export const getAuctionByIdWithoutPopulate = async (
    auctionId: string,
) => {
    return await Auction.findById(auctionId);
};