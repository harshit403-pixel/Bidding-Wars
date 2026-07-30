// Importing modules
import ChatMessage from "../models/chatMessage.model.js";

// Class to handle all chat message data access operations
class ChatMessageDAO {

    ChatMessageModel: typeof ChatMessage;

    constructor() {
        this.ChatMessageModel = ChatMessage;
    }

    // Create a new chat message
    async createMessage(data: Record<string, unknown>) {
        return await this.ChatMessageModel.create(data);
    }

    // Find messages for an auction room (paginated, chronological, excludes soft-deleted)
    async findMessagesByAuction(
        auctionId: string,
        options: { page?: number; limit?: number } = {},
    ) {
        const { page = 1, limit = 50 } = options;
        const skip = (page - 1) * limit;

        const filter = { auction: auctionId, isDeleted: false };

        const [messages, total] = await Promise.all([
            this.ChatMessageModel.find(filter)
                .populate("sender", "name avatar")
                .sort({ createdAt: 1 }) // Chronological order for chat display
                .skip(skip)
                .limit(limit)
                .lean(),
            this.ChatMessageModel.countDocuments(filter),
        ]);

        return { messages, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // Find a single message by ID
    async findMessageById(messageId: string) {
        return await this.ChatMessageModel.findById(messageId)
            .populate("sender", "name avatar")
            .lean();
    }

    // Soft delete a message (set isDeleted = true instead of removing the document)
    async softDeleteMessage(messageId: string) {
        return await this.ChatMessageModel.findByIdAndUpdate(
            messageId,
            { isDeleted: true },
            { new: true },
        );
    }

    // Hard delete all messages for an auction (cleanup when auction is deleted)
    async deleteMessagesByAuction(auctionId: string) {
        return await this.ChatMessageModel.deleteMany({ auction: auctionId });
    }

    // Count messages in an auction room (excludes soft-deleted)
    async countMessagesByAuction(auctionId: string) {
        return await this.ChatMessageModel.countDocuments({
            auction: auctionId,
            isDeleted: false,
        });
    }
}

export default ChatMessageDAO;
