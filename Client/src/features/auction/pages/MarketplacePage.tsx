import { useState } from "react";
import { Link } from "react-router";
import { Search, Gavel, ArrowUpRight } from "lucide-react";

import { useAuctions } from "../hooks/useAuctions";
import { AUCTION_CATEGORIES, type AuctionCategory } from "../auction.types";

const SORT_OPTIONS = [
    { value: "-createdAt", label: "Newest" },
    { value: "endTime", label: "Ending Soon" },
    { value: "-currentPrice", label: "Highest Price" },
    { value: "currentPrice", label: "Lowest Price" },
] as const;

function MarketplacePage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<AuctionCategory | "">("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [sort, setSort] = useState("-createdAt");
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useAuctions({
        status: selectedStatus === "all" ? undefined : (selectedStatus as any),
        category: selectedCategory || undefined,
        search: search || undefined,
        sort,
        page,
        limit: 12,
    });

    const auctions = data?.auctions ?? [];
    const totalPages = data?.totalPages ?? 1;

    return (
        <div className="min-h-screen bg-[#F5F1EB] text-[#111111]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:py-20">
                <div className="mb-8 sm:mb-12 md:mb-16">
                    <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#FF3B00] sm:mb-3 sm:text-sm sm:tracking-[0.35em]">
                        Live Marketplace
                    </p>
                    <h1
                        className="text-4xl uppercase sm:text-5xl md:text-6xl"
                        style={{ fontFamily: "Bebas Neue" }}
                    >
                        Browse Auctions
                    </h1>
                </div>

                <div className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:mb-8 sm:flex-row sm:items-center sm:gap-6 sm:pb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 sm:left-4" />
                        <input
                            type="text"
                            placeholder="Search auctions..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full border border-neutral-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#FF3B00] sm:py-3 sm:pl-11 sm:pr-4"
                        />
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setPage(1);
                        }}
                        className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#FF3B00] sm:w-auto sm:px-4 sm:py-3"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4 flex flex-wrap gap-2 sm:mb-6 sm:gap-3">
                    {[
                        { key: "all", label: "All Statuses" },
                        { key: "active", label: "Live Active" },
                        { key: "upcoming", label: "Upcoming" },
                        { key: "ended", label: "Ended" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setSelectedStatus(tab.key);
                                setPage(1);
                            }}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                                selectedStatus === tab.key
                                    ? "bg-black text-white"
                                    : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="mb-8 flex flex-wrap gap-2 sm:mb-10 sm:gap-3">
                    <button
                        onClick={() => {
                            setSelectedCategory("");
                            setPage(1);
                        }}
                        className={`border px-3 py-1.5 text-xs uppercase tracking-[0.15em] transition sm:px-5 sm:py-2 sm:text-sm sm:tracking-[0.2em] ${
                            selectedCategory === ""
                                ? "border-[#FF3B00] bg-[#FF3B00] text-white"
                                : "border-neutral-300 text-neutral-500 hover:border-[#FF3B00] hover:text-[#FF3B00]"
                        }`}
                    >
                        All
                    </button>
                    {AUCTION_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setPage(1);
                            }}
                            className={`border px-3 py-1.5 text-xs uppercase tracking-[0.15em] transition sm:px-5 sm:py-2 sm:text-sm sm:tracking-[0.2em] ${
                                selectedCategory === cat
                                    ? "border-[#FF3B00] bg-[#FF3B00] text-white"
                                    : "border-neutral-300 text-neutral-500 hover:border-[#FF3B00] hover:text-[#FF3B00]"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {isLoading && (
                    <div className="py-20 text-center text-neutral-500 sm:py-32">Loading auctions...</div>
                )}

                {isError && (
                    <div className="py-20 text-center text-[#FF3B00] sm:py-32">Failed to load auctions.</div>
                )}

                {!isLoading && !isError && auctions.length === 0 && (
                    <div className="py-20 text-center text-neutral-500 sm:py-32">
                        No auctions found.
                    </div>
                )}

                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {auctions.map((auction) => (
                        <Link
                            key={auction._id}
                            to={`/auction/${auction.roomId}`}
                            className="group cursor-pointer"
                        >
                            <div className="overflow-hidden bg-neutral-200">
                                {auction.images[0] ? (
                                    <img
                                        src={auction.images[0]}
                                        alt={auction.title}
                                        className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex aspect-[4/5] items-center justify-center">
                                        <Gavel className="h-12 w-12 text-neutral-400 sm:h-16 sm:w-16" />
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 flex items-start justify-between sm:mt-5">
                                <div>
                                    <h3 className="text-lg font-semibold sm:text-2xl">{auction.title}</h3>
                                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500 sm:mt-2 sm:text-sm sm:tracking-[0.25em]">
                                        {auction.category}
                                    </p>
                                </div>
                                <ArrowUpRight
                                    size={18}
                                    className="mt-0.5 transition group-hover:text-[#FF3B00] sm:mt-1 sm:size-[22px]"
                                />
                            </div>

                            <div className="mt-4 flex items-end justify-between border-t border-neutral-300 pt-4 sm:mt-6 sm:pt-5">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">
                                        Current Bid
                                    </p>
                                    <h4 className="mt-0.5 text-xl font-bold text-[#FF3B00] sm:mt-1 sm:text-3xl">
                                        ₹{auction.currentPrice.toLocaleString()}
                                    </h4>
                                </div>

                                <div className="text-right text-xs text-neutral-500 sm:text-sm">
                                    <p>{auction.participantsCount} Watching</p>
                                    <p>{auction.totalBids} Bids</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-3 sm:mt-12 sm:gap-4">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="border border-neutral-300 px-3 py-2 text-xs uppercase tracking-[0.15em] transition hover:border-[#FF3B00] hover:text-[#FF3B00] disabled:opacity-50 disabled:cursor-not-allowed sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-[0.2em]"
                        >
                            Previous
                        </button>
                        <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 sm:text-sm sm:tracking-[0.25em]">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="border border-neutral-300 px-3 py-2 text-xs uppercase tracking-[0.15em] transition hover:border-[#FF3B00] hover:text-[#FF3B00] disabled:opacity-50 disabled:cursor-not-allowed sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-[0.2em]"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MarketplacePage;
