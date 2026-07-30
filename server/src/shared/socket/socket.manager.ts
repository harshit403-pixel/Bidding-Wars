import { Server } from "socket.io";
import logger from "../config/logger.config.js";
import { AuctionRoom, SocketUser, BidRateLimit } from "./socket.types.js";

class SocketManager {
    private io: Server | null = null;
    private rooms: Map<string, AuctionRoom> = new Map();
    private userSockets: Map<string, Set<string>> = new Map();
    private rateLimits: Map<string, BidRateLimit> = new Map();

    setIO(io: Server) {
        this.io = io;
    }

    getIO(): Server | null {
        return this.io;
    }

    getRoom(roomId: string): AuctionRoom | undefined {
        return this.rooms.get(roomId);
    }

    createRoom(roomId: string, auctionId: string): AuctionRoom {
        const room: AuctionRoom = { roomId, auctionId, participants: new Map() };
        this.rooms.set(roomId, room);
        return room;
    }

    deleteRoom(roomId: string) {
        this.rooms.delete(roomId);
    }

    addUserToRoom(roomId: string, user: SocketUser) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.participants.set(user.socketId, user);
            this.trackUserSocket(user.userId, user.socketId);
        }
    }

    removeUserFromRoom(roomId: string, socketId: string): SocketUser | undefined {
        const room = this.rooms.get(roomId);
        if (!room) return undefined;

        const user = room.participants.get(socketId);
        if (user) {
            room.participants.delete(socketId);
            this.untrackUserSocket(user.userId, socketId);
        }
        return user;
    }

    getParticipantCount(roomId: string): number {
        const room = this.rooms.get(roomId);
        return room ? room.participants.size : 0;
    }

    broadcastToRoom(roomId: string, event: string, data: unknown) {
        if (!this.io) return;
        this.io.to(roomId).emit(event, data);
    }

    emitToSocket(socketId: string, event: string, data: unknown) {
        if (!this.io) return;
        this.io.to(socketId).emit(event, data);
    }

    private trackUserSocket(userId: string, socketId: string) {
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId)!.add(socketId);
    }

    private untrackUserSocket(userId: string, socketId: string) {
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.delete(socketId);
            if (sockets.size === 0) {
                this.userSockets.delete(userId);
            }
        }
    }

    getUserSocketCount(userId: string): number {
        return this.userSockets.get(userId)?.size || 0;
    }

    isRateLimited(socketId: string): boolean {
        const now = Date.now();
        const limit = this.rateLimits.get(socketId);
        if (limit && now - limit.lastBidTime < 200) {
            return true;
        }
        this.rateLimits.set(socketId, { lastBidTime: now });
        return false;
    }

    cleanupSocket(socketId: string) {
        this.rateLimits.delete(socketId);
    }

    findRoomBySocketId(socketId: string): string | undefined {
        for (const [roomId, room] of this.rooms) {
            if (room.participants.has(socketId)) {
                return roomId;
            }
        }
        return undefined;
    }
}

const socketManager = new SocketManager();
export default socketManager;
