import { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
    userId?: string;
    username?: string;
}

export interface SocketUser {
    socketId: string;
    userId: string;
    username: string;
}

export interface AuctionRoom {
    roomId: string;
    auctionId: string;
    participants: Map<string, SocketUser>;
}

export interface JoinAuctionPayload {
    roomId: string;
}

export interface LeaveAuctionPayload {
    roomId: string;
}

export interface PlaceBidPayload {
    roomId: string;
    auctionId: string;
    amount: number;
}

export interface AuctionState {
    auction: Record<string, unknown>;
    highestBidder: Record<string, unknown> | null;
    currentPrice: number;
    remainingSeconds: number;
    participants: number;
    status: string;
}

export interface TimerUpdate {
    auctionId: string;
    remainingSeconds: number;
    status: string;
    currentPrice: number;
    highestBidder: Record<string, unknown> | null;
}

export interface SocketError {
    code: string;
    message: string;
}

export interface BidRateLimit {
    lastBidTime: number;
}
