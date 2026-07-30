import { useState } from "react";
import { useParams } from "react-router";
import { Clock, Tag, Shield, ChevronLeft, ChevronRight, Gavel } from "lucide-react";

import { useAuction } from "../features/auction/hooks/useAuctions";
import { useAuctionSocket } from "../socket/useAuctionSocket";
import { useSocket } from "../socket/useSocket";
import type { BidPayload } from "../socket/socket.types";

function AuctionDetailPage() {
    const { roomId } = useParams<{ roomId: string }>();
    const { auction: socketAuction, connected, placeBid } = useAuctionSocket(roomId);
    const { connected: socketConnected } = useSocket();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bidAmount, setBidAmount] = useState("");

    const auctionId = socketAuction?.auction._id;
    const { data: apiAuction, isLoading: apiLoading } = useAuction(auctionId);

    const auction = socketAuction?.auction ?? apiAuction;
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
                                        {auction.seller.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold sm:text-xl">{auction.seller.name}</p>
                                        {auction.seller.rating != null && (
                                            <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-neutral-500 sm:mt-1 sm:text-sm sm:tracking-[0.25em]">
                                                Rating: {auction.seller.rating}/5
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
                                <div className="border border-neutral-300 bg-neutral-100 p-4 text-center sm:p-6">
                                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 sm:text-sm sm:tracking-[0.25em]">This auction has ended</p>
                                    {auction.winner && (
                                        <p className="mt-1.5 text-lg font-bold text-[#111111] sm:mt-2 sm:text-xl">
                                            Won by {auction.winner.name}
                                        </p>
                                    )}
                                </div>
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
