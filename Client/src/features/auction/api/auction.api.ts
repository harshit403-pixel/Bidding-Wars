import api from "../../../api/axios";
import type {
    Auction,
    AuctionListResponse,
    AuctionListParams,
    BidListResponse,
    TimelineEvent,
} from "../auction.types";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const getAuctions = async (params: AuctionListParams = {}): Promise<AuctionListResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.status) searchParams.set("status", params.status);
    if (params.category) searchParams.set("category", params.category);
    if (params.seller) searchParams.set("seller", params.seller);
    if (params.winner) searchParams.set("winner", params.winner);
    if (params.search) searchParams.set("search", params.search);
    if (params.sort) searchParams.set("sort", params.sort);

    const { data } = await api.get<ApiResponse<AuctionListResponse>>("/auctions", {
        params: searchParams,
    });
    return data.data;
};

export const getAuction = async (auctionId: string): Promise<Auction> => {
    const { data } = await api.get<ApiResponse<Auction>>(`/auctions/${auctionId}`);
    return data.data;
};

export const getAuctionBids = async (
    auctionId: string,
    page = 1,
    limit = 20,
): Promise<BidListResponse> => {
    const { data } = await api.get<ApiResponse<BidListResponse>>(
        `/auctions/${auctionId}/bids`,
        { params: { page, limit } },
    );
    return data.data;
};

export const getAuctionTimeline = async (
    auctionId: string,
    page = 1,
    limit = 50,
): Promise<{ events: TimelineEvent[]; total: number; page: number; totalPages: number }> => {
    const { data } = await api.get<ApiResponse<{ events: TimelineEvent[]; total: number; page: number; totalPages: number }>>(
        `/auctions/${auctionId}/timeline`,
        { params: { page, limit } },
    );
    return data.data;
};
