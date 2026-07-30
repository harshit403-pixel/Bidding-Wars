// Importing modules
import { Request } from "express";

// Auction query request interface
export interface AuctionQueryRequest extends Request {
    query: {
        page?: string;
        limit?: string;
        status?: string;
        category?: string;
        seller?: string;
        search?: string;
        sort?: string;
    };
}

// Auction params request interface
export interface AuctionParamsRequest extends Request {
    params: {
        auctionId: string;
    };
}

// Auction bids query request interface
export interface AuctionBidsQueryRequest extends Request {
    params: {
        auctionId: string;
    };
    query: {
        page?: string;
        limit?: string;
    };
}
