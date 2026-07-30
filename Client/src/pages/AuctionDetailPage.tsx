import { useParams } from "react-router";

import { useAuctionSocket } from "../socket/useAuctionSocket";
import { useSocket } from "../socket/useSocket";
import type { BidPayload } from "../socket/socket.types";

function AuctionDetailPage() {
    const { roomId } = useParams<{ roomId: string }>();
    const { auction, connected, placeBid } = useAuctionSocket(roomId);
    const { connected: socketConnected } = useSocket();

    if (!roomId) {
        return (
            <section className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">Invalid auction room.</p>
            </section>
        );
    }

    if (!auction) {
        return (
            <section className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">
                    {socketConnected ? "Loading auction..." : "Connecting to server..."}
                </p>
            </section>
        );
    }

    const handlePlaceBid = () => {
        const payload: BidPayload = {
            roomId,
            auctionId: auction.auction._id,
            amount: auction.currentPrice + auction.auction.minimumIncrement,
        };
        placeBid(payload);
    };

    return (
        <section className="mx-auto max-w-4xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{auction.auction.title}</h1>
                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                        auction.status === "active"
                            ? "bg-green-100 text-green-700"
                            : auction.status === "ended"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {auction.status}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="text-2xl font-bold">${auction.currentPrice}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm text-gray-500">Time Left</p>
                    <p className="text-2xl font-bold">{auction.remainingSeconds}s</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="text-2xl font-bold">{auction.participants}</p>
                </div>
            </div>

            {auction.highestBidder && (
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm text-gray-500">Highest Bidder</p>
                    <p className="font-medium">{auction.highestBidder.name}</p>
                </div>
            )}

            {auction.status === "active" && (
                <button
                    onClick={handlePlaceBid}
                    disabled={!connected}
                    className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white font-medium transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {connected
                        ? `Bid $${auction.currentPrice + auction.auction.minimumIncrement}`
                        : "Connecting..."}
                </button>
            )}
        </section>
    );
}

export default AuctionDetailPage;
