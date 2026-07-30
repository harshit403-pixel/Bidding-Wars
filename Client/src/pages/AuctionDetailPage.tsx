import { useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { Clock, Tag, Shield, ChevronLeft, ChevronRight, Gavel, Play, Square, CreditCard } from "lucide-react";
import { toast } from "sonner";

import { processRazorpayPayment } from "../shared/utils/razorpay";

import { useAuction } from "../features/auction/hooks/useAuctions";
import { useAuctionSocket } from "../socket/useAuctionSocket";
import { useSocket } from "../socket/useSocket";
import type { BidPayload } from "../socket/socket.types";
import type { RootState } from "../app/store";
import api from "../api/axios";

function AuctionDetailPage() {
    const { roomId } = useParams<{ roomId: string }>();
    const queryClient = useQueryClient();
    const user = useSelector((state: RootState) => state.auth.user);
    const { auction: socketAuction, connected, placeBid } = useAuctionSocket(roomId);
    const { connected: socketConnected } = useSocket();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bidAmount, setBidAmount] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const { data: apiAuction, isLoading: apiLoading } = useAuction(roomId);

    const auction = socketAuction?.auction ?? apiAuction;
    const auctionId = auction?._id;
    const currentPrice = socketAuction?.currentPrice ?? auction?.currentPrice ?? 0;
    const remainingSeconds = socketAuction?.remainingSeconds ?? 0;
    const participants = socketAuction?.participants ?? 0;
    const status = socketAuction?.status ?? auction?.status ?? "loading";
    const highestBidder = socketAuction?.highestBidder ?? auction?.highestBidder;

    if (!roomId) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-[#F5F1EB]">
                <p className="text-neutral-500">Invalid auction room.</p>
            </section>
        );
    }

    if (!auction && (apiLoading || socketConnected)) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-[#F5F1EB]">
                <p className="text-neutral-500">Loading auction...</p>
            </section>
        );
    }

    if (!auction) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-[#F5F1EB]">
                <p className="text-neutral-500">Connecting to server...</p>
            </section>
        );
    }

    const handlePlaceBid = () => {
        const amount = bidAmount
            ? parseFloat(bidAmount)
            : currentPrice + auction.minimumIncrement;
        const payload: BidPayload = {
            roomId,
            auctionId: auction._id,
            amount,
        };
        placeBid(payload);
        setBidAmount("");
    };

    const images = auction.images ?? [];
    const minBid = currentPrice + auction.minimumIncrement;
    const sellerObj = typeof auction.seller === "object" && auction.seller !== null ? auction.seller : null;
    const sellerId = sellerObj ? sellerObj._id : String(auction.seller ?? "");
    const sellerName = sellerObj?.name ?? "Verified Seller";
    const sellerRating = sellerObj?.rating;
    const isSeller = Boolean(user && sellerId && String(sellerId) === String(user._id));

    const winnerObj = typeof auction.winner === "object" && auction.winner !== null ? auction.winner : null;
    const winnerId = winnerObj ? winnerObj._id : String(auction.winner ?? "");
    const isWinner = Boolean(user && winnerId && String(winnerId) === String(user._id));

    const handleStartNow = async () => {
        if (!auctionId) return;
        setActionLoading(true);
        try {
            await api.post(`/auctions/${auctionId}/start-now`);
            toast.success("Auction started!");
            queryClient.invalidateQueries({ queryKey: ["auction", roomId] });
            queryClient.invalidateQueries({ queryKey: ["auctions"] });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to start auction");
        } finally {
            setActionLoading(false);
        }
    };

    const handleEndNow = async () => {
        if (!auctionId) return;
        setActionLoading(true);
        try {
            await api.post(`/auctions/${auctionId}/end-now`);
            toast.success("Auction ended!");
            queryClient.invalidateQueries({ queryKey: ["auction", roomId] });
            queryClient.invalidateQueries({ queryKey: ["auctions"] });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to end auction");
        } finally {
            setActionLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}h ${m}m ${s}s`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    return (
        <div className="min-h-screen bg-[#F5F1EB] text-[#111111]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:py-20">
                <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
                    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                        <div className="overflow-hidden bg-neutral-200">
                            {images.length > 0 ? (
                                <div className="relative aspect-[4/5]">
                                    <img
                                        src={images[currentImageIndex]}
                                        alt={auction.title}
                                        className="h-full w-full object-cover"
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    setCurrentImageIndex((i) =>
                                                        i === 0 ? images.length - 1 : i - 1,
                                                    )
                                                }
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 sm:left-4 sm:p-2 transition hover:bg-white"
                                            >
                                                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setCurrentImageIndex((i) =>
                                                        i === images.length - 1 ? 0 : i + 1,
                                                    )
                                                }
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 sm:right-4 sm:p-2 transition hover:bg-white"
                                            >
                                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </button>
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 text-xs text-white sm:bottom-4 sm:px-4 sm:py-1.5 sm:text-sm">
                                                {currentImageIndex + 1} / {images.length}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="flex aspect-[4/5] items-center justify-center bg-neutral-300">
                                    <Gavel className="h-16 w-16 text-neutral-400 sm:h-20 sm:w-20" />
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`h-16 w-20 flex-shrink-0 overflow-hidden transition sm:h-20 sm:w-24 ${
                                            i === currentImageIndex
                                                ? "ring-2 ring-[#FF3B00]"
                                                : "opacity-60 hover:opacity-100"
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <h1
                                    className="text-3xl uppercase font-black sm:text-4xl md:text-5xl"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    {auction.title}
                                </h1>
                                <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-3">
                                    <span className="inline-flex items-center gap-1.5 border border-neutral-300 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500 sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm sm:tracking-[0.25em]">
                                        <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        {auction.category}
                                    </span>
                                    {auction.condition && (
                                        <span className="inline-flex items-center gap-1.5 border border-[#FF3B00] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FF3B00] sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm sm:tracking-[0.25em]">
                                            <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                            {auction.condition}
                                        </span>
                                    )}
                                    <span
                                        className={`border px-3 py-1 text-xs uppercase tracking-[0.2em] sm:px-4 sm:py-1.5 sm:text-sm sm:tracking-[0.25em] ${
                                            status === "active"
                                                ? "border-[#FF3B00] text-[#FF3B00]"
                                                : status === "ended"
                                                  ? "border-neutral-400 text-neutral-400"
                                                  : "border-neutral-300 text-neutral-500"
                                        }`}
                                    >
                                        {status}
                                    </span>
                                </div>
                            </div>

                            {auction.description && (
                                <div className="border-t border-neutral-200 pt-6 sm:pt-8">
                                    <h2
                                        className="mb-3 text-2xl uppercase font-black sm:mb-4 sm:text-3xl"
                                        style={{ fontFamily: "Bebas Neue" }}
                                    >
                                        Description
                                    </h2>
                                    <p className="text-sm leading-6 text-neutral-600 sm:text-base sm:leading-8">
                                        {auction.description}
                                    </p>
                                </div>
                            )}

                            <div className="border-t border-neutral-200 pt-6 sm:pt-8">
                                <h2
                                    className="mb-4 text-2xl uppercase font-black sm:mb-6 sm:text-3xl"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    Seller
                                </h2>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center bg-neutral-200 text-sm font-bold text-[#111111] sm:h-14 sm:w-14 sm:text-lg">
                                        {sellerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold sm:text-xl">{sellerName}</p>
                                        {sellerRating != null && (
                                            <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-neutral-500 sm:mt-1 sm:text-sm sm:tracking-[0.25em]">
                                                Rating: {sellerRating}/5
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="sticky top-20 border border-neutral-200 bg-white p-4 sm:p-6 md:p-8">
                            <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4">
                                <div className="bg-neutral-100 p-3 text-center sm:p-5">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">Current Bid</p>
                                    <p
                                        className="mt-1 text-2xl font-bold text-[#FF3B00] sm:mt-2 sm:text-3xl md:text-4xl"
                                        style={{ fontFamily: "Bebas Neue" }}
                                    >
                                        ₹{currentPrice.toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-neutral-100 p-3 text-center sm:p-5">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">Time Left</p>
                                    <p
                                        className="mt-1 text-2xl font-bold sm:mt-2 sm:text-3xl md:text-4xl"
                                        style={{ fontFamily: "Bebas Neue" }}
                                    >
                                        {formatTime(remainingSeconds)}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs sm:mb-6 sm:gap-3 sm:text-sm">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">Bids</p>
                                    <p className="mt-0.5 text-base font-bold sm:mt-1 sm:text-xl">{auction.totalBids}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">Watching</p>
                                    <p className="mt-0.5 text-base font-bold sm:mt-1 sm:text-xl">{participants}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">Min Incr</p>
                                    <p className="mt-0.5 text-base font-bold sm:mt-1 sm:text-xl">₹{auction.minimumIncrement}</p>
                                </div>
                            </div>

                            {highestBidder && (
                                <div className="mb-4 border border-[#FF3B00] bg-[#FF3B00]/5 p-3 text-center sm:mb-6 sm:p-4">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#FF3B00] sm:text-xs sm:tracking-[0.25em]">Highest Bidder</p>
                                    <p className="mt-0.5 text-sm font-semibold text-[#111111] sm:mt-1">{highestBidder.name}</p>
                                </div>
                            )}

                            {status === "upcoming" && (
                                <div className="border border-[#FF3B00]/30 bg-[#FF3B00]/5 p-4 text-center sm:p-6 space-y-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#FF3B00] sm:text-sm sm:tracking-[0.25em] font-semibold">
                                        📅 Auction Scheduled
                                    </p>
                                    <p className="text-sm text-neutral-600">
                                        Starts at {new Date(auction.startTime).toLocaleString()}
                                    </p>
                                    {isSeller && (
                                        <button
                                            onClick={handleStartNow}
                                            disabled={actionLoading}
                                            className="flex w-full items-center justify-center gap-2 border-b-2 border-green-600 bg-green-600 py-3 text-base font-medium uppercase tracking-[0.15em] text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed sm:py-4 sm:text-lg"
                                            style={{ fontFamily: "Bebas Neue" }}
                                        >
                                            <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                                            {actionLoading ? "Starting..." : "Start Auction Now"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {status === "active" && (
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:mb-2 sm:text-xs sm:tracking-[0.25em]">
                                            Your bid (min ₹{minBid})
                                        </label>
                                        <input
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            placeholder={`${minBid}`}
                                            min={minBid}
                                            step={auction.minimumIncrement}
                                            className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#FF3B00] sm:px-4 sm:py-3 sm:text-lg"
                                        />
                                    </div>
                                    <button
                                        onClick={handlePlaceBid}
                                        disabled={!connected}
                                        className="w-full border-b-2 border-[#FF3B00] bg-[#FF3B00] py-3 text-base font-medium uppercase tracking-[0.15em] text-white transition hover:bg-[#FF5A2C] disabled:opacity-50 disabled:cursor-not-allowed sm:py-4 sm:text-lg"
                                        style={{ fontFamily: "Bebas Neue" }}
                                    >
                                        {connected
                                            ? `Place Bid — ₹${bidAmount || minBid}`
                                            : "Connecting..."}
                                    </button>
                                </div>
                            )}

                            {status === "ended" && (
                                <div className="border border-neutral-300 bg-neutral-100 p-4 text-center sm:p-6 space-y-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 sm:text-sm sm:tracking-[0.25em]">This auction has ended</p>
                                    {auction.winner ? (
                                        isWinner ? (
                                            <div className="bg-emerald-50 border border-emerald-300 p-4">
                                                <p className="text-xl font-bold text-emerald-800">
                                                    🎉 Congratulations! You Won this Auction!
                                                </p>
                                                <p className="text-sm text-emerald-600 mt-1">
                                                    Winning Bid: ₹{currentPrice.toLocaleString()}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-neutral-200/60 p-4">
                                                <p className="text-lg font-bold text-neutral-700">
                                                    Auction Ended
                                                </p>
                                                <p className="text-sm text-neutral-600 mt-1">
                                                    Won by <strong className="text-neutral-900">{winnerObj?.name ?? "Highest Bidder"}</strong> for ₹{currentPrice.toLocaleString()}
                                                </p>
                                                {user && (
                                                    <p className="text-xs text-amber-700 mt-2 font-medium">
                                                        You did not win this auction.
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    ) : (
                                        <p className="text-sm font-semibold text-neutral-600">
                                            Ended with no bids placed.
                                        </p>
                                    )}

                                    {isWinner && (
                                        <button
                                            onClick={() => {
                                                processRazorpayPayment({
                                                    auctionId: auction._id,
                                                    auctionTitle: auction.title,
                                                    amount: currentPrice,
                                                    user,
                                                    onSuccess: () => {
                                                        queryClient.invalidateQueries({ queryKey: ["auction", roomId] });
                                                        queryClient.invalidateQueries({ queryKey: ["auctions"] });
                                                    },
                                                });
                                            }}
                                            className="w-full bg-[#FF3B00] hover:bg-[#FF5A2C] text-white py-3.5 px-6 font-semibold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
                                        >
                                            <CreditCard className="h-5 w-5" />
                                            Pay Now ₹{currentPrice.toLocaleString()} (Razorpay)
                                        </button>
                                    )}
                                </div>
                            )}

                            {isSeller && status === "active" && (
                                <button
                                    onClick={handleEndNow}
                                    disabled={actionLoading}
                                    className="flex w-full items-center justify-center gap-2 border-b-2 border-neutral-800 bg-neutral-800 py-3 text-base font-medium uppercase tracking-[0.15em] text-white transition hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed sm:py-4 sm:text-lg"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    <Square className="h-4 w-4 sm:h-5 sm:w-5" />
                                    {actionLoading ? "Ending..." : "End Auction Now"}
                                </button>
                            )}

                            <div className="mt-4 flex items-center gap-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500 sm:mt-6 sm:pt-5 sm:text-sm">
                                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span>
                                    Ends {new Date(auction.endTime).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuctionDetailPage;
