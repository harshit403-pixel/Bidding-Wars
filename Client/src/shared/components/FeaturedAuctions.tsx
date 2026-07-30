import { Link } from "react-router";
import { Gavel, ArrowUpRight } from "lucide-react";
import { useAuctions } from "../../features/auction/hooks/useAuctions";
import { formatCurrency } from "../utils/formatCurrency";

function FeaturedAuctions() {
    const { data } = useAuctions({ limit: 6 });
    const auctions = data?.auctions ?? [];

    return (
        <section className="bg-white py-28">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
                <div className="mb-16 flex flex-col justify-between md:flex-row md:items-end">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-[#FF3B00]">
                            Live Marketplace
                        </p>
                        <h2
                            className="mt-2 text-5xl uppercase leading-none md:text-7xl font-black text-neutral-900"
                            style={{ fontFamily: "Bebas Neue" }}
                        >
                            Featured Auctions
                        </h2>
                    </div>
                    <Link
                        to="/auctions"
                        className="mt-6 font-semibold uppercase tracking-wider text-black transition hover:text-[#FF3B00] md:mt-0"
                    >
                        View All Auctions →
                    </Link>
                </div>

                {auctions.length === 0 ? (
                    <div className="py-12 text-center text-neutral-400">
                        <Gavel className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                        <p className="text-lg font-semibold text-neutral-600">No active auctions right now</p>
                        <p className="text-sm text-neutral-400 mt-1">Be the first to list an item on the marketplace!</p>
                        <Link to="/create-auction" className="mt-4 inline-block bg-[#FF3B00] text-white px-6 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-[#FF5A2C] transition">
                            Create an Auction
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {auctions.map((auction) => (
                            <Link
                                key={auction._id}
                                to={`/auction/${auction.roomId}`}
                                className="group flex flex-col justify-between border border-neutral-200 bg-[#F5F1EB] p-6 transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
                            >
                                <div>
                                    <div className="mb-6 h-56 w-full overflow-hidden bg-neutral-200">
                                        {auction.images[0] ? (
                                            <img
                                                src={auction.images[0]}
                                                alt={auction.title}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <Gavel className="h-10 w-10 text-neutral-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-neutral-400">
                                                {auction.category}
                                            </p>
                                            <h3 className="mt-1 text-xl font-bold uppercase text-neutral-900 line-clamp-1">
                                                {auction.title}
                                            </h3>
                                        </div>
                                        <ArrowUpRight size={20} className="text-neutral-400 transition group-hover:text-[#FF3B00]" />
                                    </div>

                                    <div className="mt-4 flex items-end justify-between border-t border-neutral-100 pt-4 gap-2">
                                        <div className="min-w-0 flex-1 pr-2">
                                            <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                                                Current Bid
                                            </p>
                                            <p className="text-2xl font-black text-[#FF3B00] truncate" title={`₹${auction.currentPrice.toLocaleString()}`}>
                                                {formatCurrency(auction.currentPrice)}
                                            </p>
                                        </div>
                                        <div className="text-right text-xs text-neutral-500 flex-shrink-0">
                                            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium uppercase">
                                                {auction.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default FeaturedAuctions;