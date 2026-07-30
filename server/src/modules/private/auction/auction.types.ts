// Importing modules
import { Request } from "express";

// Create auction request body interface
export interface CreateAuctionBody {
    title: string;
    description: string;
    category: string;
    condition: string;
    images: string[];
    startingBid: number;
    minimumIncrement?: number;
    startsAt: Date;
    endsAt: Date;
}

// Update auction request body interface
export interface UpdateAuctionBody {
    title?: string;
    description?: string;
    category?: string;
    condition?: string;
    images?: string[];
    startingBid?: number;
    minimumIncrement?: number;
    startsAt?: Date;
    endsAt?: Date;
}

// Create auction request interface
export interface CreateAuctionRequest extends Request {
    body: CreateAuctionBody;
}

// Update auction request interface
export interface UpdateAuctionRequest extends Request {
    params: {
        auctionId: string;
    };
    body: UpdateAuctionBody;
}

// Auction params request interface
export interface AuctionParamsRequest extends Request {
    params: {
        auctionId: string;
    };
}

// My auctions query request interface
export interface MyAuctionsQueryRequest extends Request {
    query: {
        page?: string;
        limit?: string;
        status?: string;
    };
}
