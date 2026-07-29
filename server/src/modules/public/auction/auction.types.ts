import { Request } from "express";
import { Types } from "mongoose";

export interface AuctionBody {
    title: string;
    description: string;
    category: string;
    condition: string;
    images: string[];
    startingBid: number;
    minimumIncrement: number;
    startsAt: Date;
    endsAt: Date;
}

export interface CreateAuctionRequest extends Request {
    body: AuctionBody;
    user?: {
        _id: Types.ObjectId | string;
        userId: string;
        email: string;
        name: string;
    };
}

export interface UpdateAuctionRequest extends Request {
    params: {
        auctionId: string;
    };
    body: Partial<AuctionBody>;
    user?: {
        _id: Types.ObjectId | string;
        userId: string;
    };
}

export interface AuctionParamsRequest extends Request {
    params: {
        auctionId: string;
    };
}

export interface AuctionQueryRequest extends Request {
    query: {
        page?: string;
        limit?: string;
        status?: string;
        category?: string;
        search?: string;
        seller?: string;
        sort?: string;
    };
}