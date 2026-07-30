// Importing modules
import Auction from "../models/auction.model.js";
import { SortOrder } from "mongoose";

// Class to handle all auction data access operations
class AuctionDAO {

    AuctionModel: typeof Auction;

    constructor() {
        this.AuctionModel = Auction;
    }

    // Create a new auction document
    async createAuction(data: Record<string, unknown>) {
        return await this.AuctionModel.create(data);
    }

    // Find auction by ID with populated references (seller, highestBidder, winner)
    async findAuctionById(auctionId: string) {
        return await this.AuctionModel.findById(auctionId)
            .populate("seller", "name email avatar rating")
            .populate("highestBidder", "name avatar")
            .populate("winner", "name avatar")
            .lean();
    }

    // Find auction by ID without populating references (lightweight plain JS object)
    async findAuctionByIdLean(auctionId: string) {
        return await this.AuctionModel.findById(auctionId).lean();
    }

    // Find auction by roomId (used for socket room lookups)
    async findAuctionByRoomId(roomId: string) {
        return await this.AuctionModel.findOne({ roomId }).lean();
    }

    // Paginated auction listing with filters and sorting
    async findAuctions(
        filter: Record<string, unknown>,
        options: { page?: number; limit?: number; sort?: Record<string, SortOrder> } = {},
    ) {
        const {
            page = 1,
            limit = 10,
            sort = { createdAt: -1 as SortOrder },
        } = options;

        const skip = (page - 1) * limit;

        const [auctions, total] = await Promise.all([
            this.AuctionModel.find(filter)
                .populate("seller", "name avatar rating")
                .populate("highestBidder", "name avatar")
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            this.AuctionModel.countDocuments(filter),
        ]);

        return { auctions, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // Find auctions created by a specific seller (paginated)
    async findAuctionsBySeller(
        sellerId: string,
        options: { page?: number; limit?: number } = {},
    ) {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;

        const filter = { seller: sellerId };

        const [auctions, total] = await Promise.all([
            this.AuctionModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.AuctionModel.countDocuments(filter),
        ]);

        return { auctions, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // Find auctions won by a specific user
    async findAuctionsWonByUser(userId: string) {
        return await this.AuctionModel.find({ winner: userId })
            .populate("seller", "name avatar")
            .sort({ endedAt: -1 })
            .lean();
    }

    // Update auction fields by ID (returns the updated document)
    async updateAuctionById(auctionId: string, data: Record<string, unknown>) {
        return await this.AuctionModel.findByIdAndUpdate(
            auctionId,
            data,
            { new: true, runValidators: true },
        );
    }

    // Delete auction by ID
    async deleteAuctionById(auctionId: string) {
        return await this.AuctionModel.findByIdAndDelete(auctionId);
    }

    // Count auctions matching a filter (useful for dashboard stats)
    async countAuctions(filter: Record<string, unknown>) {
        return await this.AuctionModel.countDocuments(filter);
    }

    // Increment totalBids counter atomically
    async incrementTotalBids(auctionId: string) {
        return await this.AuctionModel.findByIdAndUpdate(
            auctionId,
            { $inc: { totalBids: 1 } },
            { new: true },
        );
    }

    // Increment participantsCount atomically
    async incrementParticipantsCount(auctionId: string) {
        return await this.AuctionModel.findByIdAndUpdate(
            auctionId,
            { $inc: { participantsCount: 1 } },
            { new: true },
        );
    }

    // Update the highest bid details (currentPrice, highestBidder)
    async updateHighestBid(auctionId: string, bidderId: string, amount: number) {
        return await this.AuctionModel.findByIdAndUpdate(
            auctionId,
            {
                currentPrice: amount,
                highestBidder: bidderId,
            },
            { new: true },
        );
    }

    // Mark auction as ended with a winner
    async endAuction(auctionId: string, winnerId: string | null) {
        return await this.AuctionModel.findByIdAndUpdate(
            auctionId,
            {
                status: "ended",
                winner: winnerId,
                endedAt: new Date(),
            },
            { new: true },
        );
    }

    // Update auction status (draft → upcoming → active → ended / cancelled)
    async updateStatus(auctionId: string, status: string) {
        return await this.AuctionModel.findByIdAndUpdate(
            auctionId,
            { status },
            { new: true, runValidators: true },
        );
    }

    // Update auction payment status
    async updatePaymentStatus(auctionId: string, paymentStatus: string) {
        return await this.AuctionModel.findByIdAndUpdate(
            auctionId,
            { paymentStatus },
            { new: true, runValidators: true },
        );
    }

    // Find auctions ending before a given time (used by scheduler/cron to auto-end)
    async findAuctionsEndingBefore(date: Date) {
        return await this.AuctionModel.find({
            status: "active",
            endTime: { $lte: date },
        }).lean();
    }

    // Find upcoming auctions starting before a given time (used by scheduler to auto-start)
    async findUpcomingAuctionsStartingBefore(date: Date) {
        return await this.AuctionModel.find({
            status: "upcoming",
            startTime: { $lte: date },
        }).lean();
    }
}

export default AuctionDAO;