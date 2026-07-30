export interface AuctionData {
    _id: string;
    title: string;
    description: string;
    category: string;
    currentPrice: number;
    startingPrice: number;
    minimumIncrement: number;
    status: "draft" | "upcoming" | "active" | "ended" | "cancelled";
    startTime: string;
    endTime: string;
    totalBids: number;
    seller: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
        rating?: number;
    };
    images: string[];
    roomId?: string;
}

export interface HighestBidder {
    _id: string;
    name: string;
    avatar?: string;
}

export interface AuctionState {
    auction: AuctionData;
    highestBidder: HighestBidder | null;
    currentPrice: number;
    remainingSeconds: number;
    participants: number;
    status: string;
}

export interface BidPayload {
    roomId: string;
    auctionId: string;
    amount: number;
}

export interface NewHighestBid {
    auction: AuctionData;
    highestBidder: HighestBidder;
    amount: number;
}

export interface TimerUpdate {
    auctionId: string;
    remainingSeconds: number;
    status: string;
    currentPrice: number;
    highestBidder: HighestBidder | null;
}

export interface ParticipantUpdate {
    participants: number;
}

export interface UserJoined {
    userId: string;
    username: string;
    participants: number;
}

export interface UserLeft {
    userId: string;
    username: string;
    participants: number;
}

export interface AuctionStarted {
    auction: AuctionData;
}

export interface AuctionEnded {
    auction: AuctionData;
}

export interface SocketError {
    code: string;
    message: string;
}
