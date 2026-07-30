// Minimal socket manager stub.
// Replace with real Socket.io implementation when socket.io is added to the project.

import logger from "../config/logger.config.js";

const socketManager = {
    emitAuctionStarted(auction: Record<string, unknown>) {
        logger.debug({ auctionId: auction._id }, "Socket emit: auction_started (stub)");
    },

    emitAuctionEnded(auction: Record<string, unknown>) {
        logger.debug({ auctionId: auction._id }, "Socket emit: auction_ended (stub)");
    },
};

export default socketManager;
