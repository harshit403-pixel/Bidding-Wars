import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Gavel, Trophy, Package, Clock, ExternalLink, Plus } from "lucide-react";

import { useDashboard } from "../features/dashboard/hooks/useDashboard";
import { useAuctions } from "../features/auction/hooks/useAuctions";
import type { RootState } from "../app/store";

function DashboardPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { data: stats, isLoading: statsLoading } = useDashboard();
    const { data: myAuctionsData, isLoading: myLoading } = useAuctions({
        seller: user?._id,
        limit: 6,
    });

    const myAuctions = myAuctionsData?.auctions ?? [];

    return (
        <div className="min-h-screen bg-[#F5F1EB] text-[#111111]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end sm:mb-12">
                    <div>
                        <p className="mb-1 text-xs uppercase tracking-[0.3em] text-[#FF3B00] sm:text-sm sm:tracking-[0.35em]">
                            Seller & Bidder Overview
                        </p>
                        <h1
                            className="text-4xl uppercase font-black sm:text-5xl md:text-6xl"
                            style={{ fontFamily: "Bebas Neue" }}
                        >
                            {user?.name ? `${user.name}'s Dashboard` : "Dashboard"}
                        </h1>
                    </div>

                    <Link
                        to="/create-auction"
                        className="inline-flex items-center justify-center gap-2 border-b-2 border-[#FF3B00] bg-[#FF3B00] px-6 py-3 font-semibold uppercase tracking-wider text-white transition hover:bg-[#FF5A2C] shadow-md"
                    >
                        <Plus className="h-5 w-5" />
                        Create New Auction
                    </Link>
                </div>

                {statsLoading ? (
                    <div className="py-20 text-center text-neutral-500">Loading dashboard...</div>
                ) : stats ? (
                    <>
                        {/* Stat Cards Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                            <Link
                                to="/auctions?status=active"
                                className="block border border-neutral-200 bg-white p-5 transition hover:shadow-md hover:border-[#FF3B00]"
                            >
                                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#FF3B00]/10">
                                    <Gavel className="h-5 w-5 text-[#FF3B00]" />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
                                    Active Marketplace
                                </p>
                                <p
                                    className="mt-1 text-3xl font-bold text-neutral-900"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    {stats.activeAuctions}
                                </p>
                            </Link>

                            <Link
                                to="/profile"
                                className="block border border-neutral-200 bg-white p-5 transition hover:shadow-md hover:border-[#FF3B00]"
                            >
                                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#FF3B00]/10">
                                    <Package className="h-5 w-5 text-[#FF3B00]" />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
                                    My Auctions
                                </p>
                                <p
                                    className="mt-1 text-3xl font-bold text-neutral-900"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    {stats.myAuctions}
                                </p>
                            </Link>

                            <Link
                                to="/profile"
                                className="block border border-neutral-200 bg-white p-5 transition hover:shadow-md hover:border-[#FF3B00]"
                            >
                                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#FF3B00]/10">
                                    <Trophy className="h-5 w-5 text-[#FF3B00]" />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
                                    Won Auctions
                                </p>
                                <p
                                    className="mt-1 text-3xl font-bold text-neutral-900"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    {stats.wonAuctions}
                                </p>
                            </Link>

                            <div className="border border-neutral-200 bg-white p-5">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#FF3B00]/10">
                                    <Clock className="h-5 w-5 text-[#FF3B00]" />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
                                    Total Bids Placed
                                </p>
                                <p
                                    className="mt-1 text-3xl font-bold text-neutral-900"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    {stats.totalBids}
                                </p>
                            </div>
                        </div>

                        {/* My Recent Listings Section */}
                        <div className="mt-12">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#FF3B00]">
                                        Your Listings
                                    </p>
                                    <h2
                                        className="text-3xl uppercase font-bold"
                                        style={{ fontFamily: "Bebas Neue" }}
                                    >
                                        My Auctions
                                    </h2>
                                </div>
                                <Link
                                    to="/profile"
                                    className="text-sm font-semibold uppercase tracking-wider text-[#FF3B00] hover:underline"
                                >
                                    Manage All →
                                </Link>
                            </div>

                            {myLoading ? (
                                <div className="py-12 text-center text-neutral-500">Loading your auctions...</div>
                            ) : myAuctions.length === 0 ? (
                                <div className="border border-neutral-200 bg-white p-8 text-center text-neutral-500">
                                    <p className="mb-2 text-base font-semibold">You haven't created any auctions yet.</p>
                                    <Link
                                        to="/create-auction"
                                        className="mt-3 inline-block bg-[#FF3B00] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#FF5A2C]"
                                    >
                                        + Create Auction
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {myAuctions.map((auction) => (
                                        <Link
                                            key={auction._id}
                                            to={`/auction/${auction.roomId}`}
                                            className="flex flex-col justify-between border border-neutral-200 bg-white p-5 transition hover:shadow-md"
                                        >
                                            <div>
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span
                                                        className={`rounded px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                                                            auction.status === "active"
                                                                ? "bg-emerald-100 text-emerald-800"
                                                                : auction.status === "upcoming"
                                                                ? "bg-amber-100 text-amber-800"
                                                                : "bg-neutral-100 text-neutral-600"
                                                        }`}
                                                    >
                                                        {auction.status}
                                                    </span>
                                                    <ExternalLink className="h-4 w-4 text-neutral-400" />
                                                </div>
                                                <h3 className="truncate font-bold text-neutral-900">{auction.title}</h3>
                                                <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                                                    {auction.description}
                                                </p>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                                                <div>
                                                    <p className="text-[10px] uppercase text-neutral-400">Current Price</p>
                                                    <p className="font-bold text-[#FF3B00]">
                                                        ₹{auction.currentPrice.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] uppercase text-neutral-400">Bids</p>
                                                    <p className="font-bold text-neutral-700">{auction.totalBids}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default DashboardPage;
