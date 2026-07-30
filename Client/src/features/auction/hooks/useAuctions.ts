import { useQuery } from "@tanstack/react-query";

import { getAuctions, getAuction, getAuctionBids } from "../api/auction.api";
import type { AuctionListParams } from "../auction.types";

export function useAuctions(params: AuctionListParams = {}) {
    return useQuery({
        queryKey: ["auctions", params],
        queryFn: () => getAuctions(params),
    });
}

export function useAuction(auctionId: string | undefined) {
    return useQuery({
        queryKey: ["auction", auctionId],
        queryFn: () => getAuction(auctionId!),
        enabled: !!auctionId,
    });
}

export function useAuctionBids(auctionId: string | undefined, page = 1) {
    return useQuery({
        queryKey: ["auction-bids", auctionId, page],
        queryFn: () => getAuctionBids(auctionId!, page),
        enabled: !!auctionId,
    });
}
