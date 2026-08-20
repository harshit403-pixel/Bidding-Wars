import { Server } from "socket.io";
import AuctionDAO from "../dao/auction.dao.js";
import BidDAO from "../dao/bid.dao.js";
import TimelineDAO from "../dao/timeline.dao.js";
import UserDao from "../dao/user.dao.js";
import logger from "../config/logger.config.js";
import socketManager from "./socket.manager.js";
import { AuthenticatedSocket, JoinAuctionPayload, PlaceBidPayload } from "./socket.types.js";

const auctionDAO = new AuctionDAO();
const bidDAO = new BidDAO();
const timelineDAO = new TimelineDAO();
const userDao = new UserDao();

export function registerSocketEvents(io: Server) {
    socketManager.setIO(io);

    io.on("connection", (socket: AuthenticatedSocket) => {
        logger.info({ socketId: socket.id, userId: socket.userId }, "Socket connected");

        socket.on("join_auction", async (payload: JoinAuctionPayload) => {
            await handleJoinAuction(socket, payload);
        });

        socket.on("leave_auction", async (payload: { roomId: string }) => {
            await handleLeaveAuction(socket, payload.roomId);
        });

        socket.on("place_bid", async (payload: PlaceBidPayload) => {
            await handlePlaceBid(socket, payload);
        });

        socket.on("send_chat_message", async (payload: { roomId: string; message: string }) => {
            await handleSendChatMessage(socket, payload);
        });

        socket.on("disconnect", async (reason) => {
            await handleDisconnect(socket, reason);
        });
    });
}

async function handleJoinAuction(socket: AuthenticatedSocket, payload: JoinAuctionPayload) {
    try {
        if (!socket.userId || !socket.username) {
            return emitError(socket, "UNAUTHORIZED", "Authentication required");
        }

        const { roomId } = payload;
        if (!roomId) {
            return emitError(socket, "INVALID_ROOM", "Room ID is required");
        }

        const auction = await auctionDAO.findAuctionByRoomId(roomId);
        if (!auction) {
            return emitError(socket, "INVALID_ROOM", "Invalid room or auction not found");
        }

        socket.join(roomId);

        let room = socketManager.getRoom(roomId);
        if (!room) {
            const endTimeMs = auction.endTime ? new Date(auction.endTime).getTime() : Date.now();
            const startTimeMs = auction.startTime ? new Date(auction.startTime).getTime() : Date.now();
            room = socketManager.createRoom(roomId, auction._id.toString(), endTimeMs, startTimeMs, auction.status);
        } else {
            room.status = auction.status;
        }

        const existingParticipant = room.participants.get(socket.id);
        if (!existingParticipant) {
            socketManager.addUserToRoom(roomId, {
                socketId: socket.id,
                userId: socket.userId,
                username: socket.username,
            });

            await auctionDAO.incrementParticipantsCount(auction._id.toString());

            socketManager.broadcastToRoom(roomId, "user_joined", {
                userId: socket.userId,
                username: socket.username,
                participants: socketManager.getParticipantCount(roomId),
            });

            socketManager.broadcastToRoom(roomId, "participants_updated", {
                participants: socketManager.getParticipantCount(roomId),
            });
        }

        const participantCount = socketManager.getParticipantCount(roomId);
        const highestBid = await bidDAO.findHighestBidWithTiebreaker(auction._id.toString());
        const remainingSeconds = Math.max(0, Math.floor(((auction.endTime ? new Date(auction.endTime).getTime() : Date.now()) - Date.now()) / 1000));

        const auctionState = {
            auction: {
                _id: auction._id,
                title: auction.title,
                currentPrice: auction.currentPrice,
                startingPrice: auction.startingPrice,
                minimumIncrement: auction.minimumIncrement,
                status: auction.status,
                endTime: auction.endTime,
                startTime: auction.startTime,
                totalBids: auction.totalBids,
                seller: auction.seller,
                images: auction.images,
                category: auction.category,
                description: auction.description,
            },
            highestBidder: highestBid?.bidder || null,
            currentPrice: auction.currentPrice,
            remainingSeconds,
            participants: participantCount,
            status: auction.status,
            chatMessages: room?.chatMessages || [],
        };

        socketManager.emitToSocket(socket.id, "auction_state", auctionState);

        logger.debug({ socketId: socket.id, roomId, userId: socket.userId }, "Socket: joined auction room");
    } catch (error) {
        logger.error({ socketId: socket.id, error }, "Socket: join_auction error");
        emitError(socket, "JOIN_ERROR", "Failed to join auction");
    }
}

async function handleLeaveAuction(socket: AuthenticatedSocket, roomId: string) {
    try {
        if (!roomId) {
            return emitError(socket, "INVALID_ROOM", "Room ID is required");
        }

        let room = socketManager.getRoom(roomId);
        if (!room) {
            for (const r of socketManager.getAllRooms().values()) {
                if (r.auctionId === roomId || r.roomId === roomId) {
                    room = r;
                    break;
                }
            }
        }
        if (!room) return;

        const targetRoomId = room.roomId;
        const user = socketManager.removeUserFromRoom(targetRoomId, socket.id);
        if (user) {
            socket.leave(targetRoomId);

            await auctionDAO.decrementParticipantsCount(room.auctionId);

            const participantCount = socketManager.getParticipantCount(targetRoomId);

            socketManager.broadcastToRoom(targetRoomId, "user_left", {
                userId: socket.userId,
                username: socket.username,
                participants: participantCount,
            });

            socketManager.broadcastToRoom(targetRoomId, "participants_updated", {
                participants: participantCount,
            });

            logger.debug({ socketId: socket.id, roomId: targetRoomId, userId: socket.userId }, "Socket: left auction room");
        }
    } catch (error) {
        logger.error({ socketId: socket.id, error }, "Socket: leave_auction error");
    }
}

async function handlePlaceBid(socket: AuthenticatedSocket, payload: PlaceBidPayload) {
    try {
        if (!socket.userId || !socket.username || (socket as any).isGuest || socket.userId.startsWith("guest_")) {
            return emitError(socket, "UNAUTHORIZED", "Please log in or create an account to place bids.");
        }

        const dbUser = await userDao.findUserById(socket.userId);
        if (!dbUser || !dbUser.isVerified) {
            return emitError(socket, "NOT_VERIFIED", "Your account is not verified. Please verify your email before placing bids.");
        }

        if (socketManager.isRateLimited(socket.id)) {
            return emitError(socket, "RATE_LIMITED", "Bidding too fast. Please wait 200ms between bids.");
        }

        const { roomId, auctionId, amount } = payload;

        if (!roomId || !auctionId) {
            return emitError(socket, "INVALID_PAYLOAD", "Room ID and Auction ID are required");
        }

        if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
            return emitError(socket, "INVALID_AMOUNT", "Bid amount must be a positive number");
        }

        const auction = await auctionDAO.findAuctionById(auctionId);
        if (!auction) {
            return emitError(socket, "AUCTION_NOT_FOUND", "Auction not found");
        }

        if (auction.status !== "active") {
            return emitError(socket, "AUCTION_NOT_ACTIVE", "Auction is not active");
        }

        if (auction.endTime && new Date(auction.endTime).getTime() <= Date.now()) {
            return emitError(socket, "AUCTION_ENDED", "Auction has ended");
        }

        const sellerId = typeof auction.seller === "object" && auction.seller !== null
            ? (auction.seller as { _id: { toString(): string } })._id.toString()
            : String(auction.seller);

        if (sellerId === socket.userId) {
            return emitError(socket, "SELLER_BID_REJECTED", "Sellers cannot bid on their own auction");
        }

        const minBid = auction.currentPrice + auction.minimumIncrement;
        if (amount < minBid) {
            return emitError(socket, "BID_TOO_LOW", `Bid must be at least ${minBid}`);
        }

        const bid = await bidDAO.createBid({
            auction: auctionId,
            bidder: socket.userId,
            amount,
            isWinningBid: false,
            placedAt: new Date(),
        });

        await auctionDAO.updateHighestBid(auctionId, socket.userId, amount);
        await auctionDAO.incrementTotalBids(auctionId);

        await timelineDAO.createEvent({
            auction: auctionId,
            user: socket.userId,
            type: "BID_PLACED",
            message: `${socket.username} placed a bid of ${amount}`,
            metadata: { amount, bidderId: socket.userId, bidderName: socket.username },
        });

        const updatedAuction = await auctionDAO.findAuctionByIdLean(auctionId);

        socketManager.broadcastToRoom(roomId, "new_highest_bid", {
            auction: updatedAuction,
            highestBidder: { _id: socket.userId, name: socket.username },
            amount,
        });

        logger.info({ socketId: socket.id, auctionId, amount, userId: socket.userId }, "Socket: bid placed");
    } catch (error) {
        logger.error({ socketId: socket.id, error }, "Socket: place_bid error");
        emitError(socket, "BID_ERROR", "Failed to place bid");
    }
}

async function handleDisconnect(socket: AuthenticatedSocket, reason: string) {
    try {
        const roomIds = socketManager.findAllRoomsBySocketId(socket.id);
        for (const roomId of roomIds) {
            await handleLeaveAuction(socket, roomId);
        }

        socketManager.cleanupSocket(socket.id);

        logger.info({ socketId: socket.id, userId: socket.userId, reason }, "Socket disconnected");
    } catch (error) {
        logger.error({ socketId: socket.id, error }, "Socket: disconnect cleanup error");
    }
}

async function handleSendChatMessage(socket: AuthenticatedSocket, payload: { roomId: string; message: string }) {
    try {
        if (!socket.userId || (socket as any).isGuest || socket.userId.startsWith("guest_")) {
            return emitError(socket, "UNAUTHORIZED", "Please log in to send chat messages.");
        }

        const dbUser = await userDao.findUserById(socket.userId);
        if (!dbUser || !dbUser.isVerified) {
            return emitError(socket, "NOT_VERIFIED", "Your account is not verified. Please verify your email before sending chat messages.");
        }

        const username = socket.username || "User";
        const { roomId, message } = payload;
        if (!roomId || !message || typeof message !== "string" || !message.trim()) {
            return;
        }

        const trimmed = message.trim().slice(0, 300);

        let targetRoomId = roomId;
        let room = socketManager.getRoom(roomId);
        if (!room) {
            const auction = await auctionDAO.findAuctionById(roomId);
            if (auction && auction.roomId) {
                targetRoomId = auction.roomId;
                room = socketManager.getRoom(targetRoomId);
            }
        }

        const chatMsg = {
            id: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            userId: socket.userId,
            username,
            message: trimmed,
            timestamp: new Date().toISOString(),
        };

        if (targetRoomId) {
            socketManager.addChatMessage(targetRoomId, chatMsg);
            socketManager.broadcastToRoom(targetRoomId, "new_chat_message", chatMsg);
        }
        if (roomId && roomId !== targetRoomId) {
            socketManager.addChatMessage(roomId, chatMsg);
            socketManager.broadcastToRoom(roomId, "new_chat_message", chatMsg);
        }
        socket.emit("new_chat_message", chatMsg);
    } catch (error) {
        logger.error({ socketId: socket.id, error }, "Socket: handleSendChatMessage error");
    }
}

function emitError(socket: AuthenticatedSocket, code: string, message: string) {
    socket.emit("socket_error", { code, message });
}
