// Importing modules
import Timeline from "../models/timeline.model.js";

// Class to handle all timeline data access operations
class TimelineDAO {

    TimelineModel: typeof Timeline;

    constructor() {
        this.TimelineModel = Timeline;
    }

    // Create a new timeline event
    async createEvent(data: Record<string, unknown>) {
        return await this.TimelineModel.create(data);
    }

    // Find all timeline events for an auction (reverse chronological)
    async findEventsByAuction(
        auctionId: string,
        options: { page?: number; limit?: number } = {},
    ) {
        const { page = 1, limit = 50 } = options;
        const skip = (page - 1) * limit;

        const filter = { auction: auctionId };

        const [events, total] = await Promise.all([
            this.TimelineModel.find(filter)
                .populate("user", "name avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.TimelineModel.countDocuments(filter),
        ]);

        return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // Find timeline events by type for a specific auction
    async findEventsByAuctionAndType(auctionId: string, type: string) {
        return await this.TimelineModel.find({ auction: auctionId, type })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 })
            .lean();
    }

    // Find all timeline events for a specific user
    async findEventsByUser(userId: string) {
        return await this.TimelineModel.find({ user: userId })
            .populate("auction", "title status")
            .sort({ createdAt: -1 })
            .lean();
    }

    // Find a single event by ID
    async findEventById(eventId: string) {
        return await this.TimelineModel.findById(eventId)
            .populate("user", "name avatar")
            .populate("auction", "title")
            .lean();
    }

    // Delete all timeline events for an auction (cleanup when auction is deleted)
    async deleteEventsByAuction(auctionId: string) {
        return await this.TimelineModel.deleteMany({ auction: auctionId });
    }
}

export default TimelineDAO;
