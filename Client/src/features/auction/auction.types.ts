export const AUCTION_CATEGORIES = [
    "Electronics",
    "Fashion",
    "Home",
    "Books",
    "Sports",
    "Vehicles",
    "Collectibles",
    "Others",
] as const;

export type AuctionCategory = (typeof AUCTION_CATEGORIES)[number];

export const ITEM_CONDITIONS = [
    "New",
    "Like New",
    "Good",
    "Fair",
    "Poor",
] as const;

export type ItemCondition = (typeof ITEM_CONDITIONS)[number];

export type AuctionStatus = "draft" | "upcoming" | "active" | "ended" | "cancelled";

export interface AuctionSeller {
    _id: string;
    name: string;
    avatar?: string;
    rating?: number;
}

export interface AuctionHighestBidder {
    _id: string;
    name: string;
    avatar?: string;
}

export interface AuctionWinner {
    _id: string;
    name: string;
    avatar?: string;
}

export interface Auction {
    _id: string;
    title: string;
    description: string;
    category: AuctionCategory;
    condition?: ItemCondition;
    images: string[];
    startingPrice: number;
    currentPrice: number;
    minimumIncrement: number;
    totalBids: number;
    participantsCount: number;
    status: AuctionStatus;
    paymentStatus?: "pending" | "paid" | "failed" | "cancelled";
    startTime: string;
    endTime: string;
    endedAt?: string;
    roomId?: string;
    seller: AuctionSeller;
    highestBidder?: AuctionHighestBidder;
    winner?: AuctionWinner;
    createdAt: string;
    updatedAt: string;
}

export interface AuctionListResponse {
    auctions: Auction[];
    total: number;
    page: number;
    totalPages: number;
}

export interface AuctionListParams {
    page?: number;
    limit?: number;
    status?: AuctionStatus;
    category?: AuctionCategory;
    seller?: string;
    winner?: string;
    search?: string;
    sort?: string;
}

export interface Bid {
    _id: string;
    auction: string;
    bidder: {
        _id: string;
        name: string;
        avatar?: string;
    };
    amount: number;
    isWinningBid: boolean;
    placedAt: string;
}

export interface BidListResponse {
    bids: Bid[];
    total: number;
    page: number;
    totalPages: number;
}

export interface TimelineEvent {
    _id: string;
    auction: string;
    user?: {
        _id: string;
        name: string;
        avatar?: string;
    };
    type: string;
    message: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}
