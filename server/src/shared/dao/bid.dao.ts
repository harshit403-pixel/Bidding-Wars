// Importing modules
import Bid from "../models/bid.model.js";

// Class to handle all bid data access operations
class BidDAO {

    BidModel: typeof Bid;

    constructor() {
        this.BidModel = Bid;
    }

    // Create a new bid document
    async createBid(data: Record<string, unknown>) {
        return await this.BidModel.create(data);
    }

    // Find a bid by ID
    async findBidById(bidId: string) {
        return await this.BidModel.findById(bidId)
            .populate("bidder", "name avatar")
            .lean();
    }

    // Find all bids for an auction (sorted by newest first)
    async findBidsByAuction(
        auctionId: string,
        options: { page?: number; limit?: number } = {},
    ) {
        const { page = 1, limit = 20 } = options;
        const skip = (page - 1) * limit;

        const filter = { auction: auctionId };

        const [bids, total] = await Promise.all([
            this.BidModel.find(filter)
                .populate("bidder", "name avatar")
                .sort({ placedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.BidModel.countDocuments(filter),
        ]);

        return { bids, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // Find all bids placed by a specific user
    async findBidsByUser(userId: string) {
        return await this.BidModel.find({ bidder: userId })
            .populate("auction", "title status currentPrice")
            .sort({ placedAt: -1 })
            .lean();
    }

    // Find the highest bid for a specific auction
    async findHighestBid(auctionId: string) {
        return await this.BidModel.findOne({ auction: auctionId })
            .sort({ amount: -1 })
            .populate("bidder", "name avatar")
            .lean();
    }

    // Find the highest bid with tiebreaker: same amount → oldest bid wins (placedAt ascending)
    async findHighestBidWithTiebreaker(auctionId: string) {
        return await this.BidModel.findOne({ auction: auctionId })
            .sort({ amount: -1, placedAt: 1 })
            .populate("bidder", "name avatar")
            .lean();
    }

    // Mark a bid as the winning bid
    async markWinningBid(bidId: string) {
        return await this.BidModel.findByIdAndUpdate(
            bidId,
            { isWinningBid: true },
            { new: true },
        );
    }

    // Mark the highest bid of an auction as the winning bid (by auction + highest amount + oldest tiebreaker)
    async markWinningBidByAuction(auctionId: string) {
        // Use a lean-less query here since we need the _id for the subsequent update
        const highestBid = await this.BidModel.findOne({ auction: auctionId })
            .sort({ amount: -1, placedAt: 1 });
        if (!highestBid) return null;

        return await this.BidModel.findByIdAndUpdate(
            highestBid._id,
            { isWinningBid: true },
            { new: true },
        );
    }

    // Count total bids for an auction
    async countBidsByAuction(auctionId: string) {
        return await this.BidModel.countDocuments({ auction: auctionId });
    }

    // Count total bids placed by a user (useful for dashboard)
    async countBidsByUser(userId: string) {
        return await this.BidModel.countDocuments({ bidder: userId });
    }

    // Count unique participants (distinct bidders) for an auction
    async countUniqueParticipants(auctionId: string) {
        const participants = await this.BidModel.distinct("bidder", { auction: auctionId });
        return participants.length;
    }

    // Check if a user has already bid on an auction (first-time participant check)
    async hasUserBidOnAuction(auctionId: string, userId: string) {
        const bid = await this.BidModel.findOne({ auction: auctionId, bidder: userId }).lean();
        return !!bid;
    }

    // Delete all bids for an auction (used when auction is deleted before starting)
    async deleteBidsByAuction(auctionId: string) {
        return await this.BidModel.deleteMany({ auction: auctionId });
    }
}

export default BidDAO;
