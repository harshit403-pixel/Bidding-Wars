// Real socket manager implementation for scheduler.
// Broadcasts auction_started and auction_ended to all connected clients.

import { getIO } from "../socket/socket.js";
import logger from "../config/logger.config.js";

const socketManager = {
    emitAuctionStarted(auction: Record<string, unknown>) {
        const io = getIO();
        if (!io) {
            logger.debug({ auctionId: auction._id }, "Socket emit: auction_started (no socket server)");
            return;
        }

        if (auction.roomId) {
            io.to(String(auction.roomId)).emit("auction_started", { auction });
        }
        io.emit("auction_started", { auction });

        logger.debug({ auctionId: auction._id }, "Socket emit: auction_started");
    },

    emitAuctionEnded(auction: Record<string, unknown>) {
        const io = getIO();
        if (!io) {
            logger.debug({ auctionId: auction._id }, "Socket emit: auction_ended (no socket server)");
            return;
        }

        if (auction.roomId) {
            io.to(String(auction.roomId)).emit("auction_ended", { auction });
        }
        io.emit("auction_ended", { auction });

        logger.debug({ auctionId: auction._id }, "Socket emit: auction_ended");
    },
};

export default socketManager;
