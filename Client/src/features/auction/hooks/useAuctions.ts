import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAuctions, getAuction, getAuctionBids, getAuctionTimeline, updateAuctionApi, deleteAuctionApi } from "../api/auction.api";
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

export function useAuctionTimeline(auctionId: string | undefined, page = 1) {
    return useQuery({
        queryKey: ["auction-timeline", auctionId, page],
        queryFn: () => getAuctionTimeline(auctionId!, page),
        enabled: !!auctionId,
        refetchInterval: 3000,
    });
}

export function useUpdateAuction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ auctionId, data }: { auctionId: string; data: Record<string, unknown> }) =>
            updateAuctionApi(auctionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auctions"] });
            queryClient.invalidateQueries({ queryKey: ["auction"] });
        },
    });
}

export function useDeleteAuction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (auctionId: string) => deleteAuctionApi(auctionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auctions"] });
            queryClient.invalidateQueries({ queryKey: ["auction"] });
        },
    });
}
