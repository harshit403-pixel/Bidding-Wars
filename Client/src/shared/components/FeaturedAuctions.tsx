import { Link } from "react-router";
import { Gavel, ArrowUpRight } from "lucide-react";
import { useAuctions } from "../../features/auction/hooks/useAuctions";

function FeaturedAuctions() {
    const { data } = useAuctions({ limit: 6 });
    const auctions = data?.auctions ?? [];

    return (
        <section className="bg-white py-28">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="mt-6 text-5xl font-black uppercase leading-none text-neutral-900 md:text-7xl">
                            Bid On
                            <br />
                            Extraordinary
                            <br />
                            Items.
                        </h2>
                    </div>

                    <div className="max-w-md">
                        <p className="mb-8 text-lg leading-8 text-neutral-500">
                            Explore handpicked auctions featuring premium
                            collectibles, luxury goods, gadgets and rare finds
                            from verified sellers around the world.
                        </p>

                        <Link
                            to="/auctions"
                            className="inline-flex items-center gap-3 rounded-full bg-black px-7 py-4 font-medium text-white transition hover:scale-105 hover:bg-[#FF5A1F]"
                        >
                            Explore Marketplace
                        </Link>
                    </div>
                </div>

                {auctions.length === 0 ? (
                    <div className="py-12 text-center text-neutral-500">
                        No auctions available right now.{" "}
                        <Link to="/create-auction" className="text-[#FF3B00] underline">
                            Create the first one!
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {auctions.map((auction) => (
                            <Link
                                key={auction._id}
                                to={`/auction/${auction.roomId}`}
                                className="group cursor-pointer border border-neutral-200 bg-white p-4 transition hover:shadow-lg"
                            >
                                <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                                    {auction.images[0] ? (
                                        <img
                                            src={auction.images[0]}
                                            alt={auction.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Gavel className="h-16 w-16 text-neutral-300" />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex items-start justify-between">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-xl font-bold text-neutral-900">
                                            {auction.title}
                                        </h3>
                                        <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
                                            {auction.category}
                                        </p>
                                    </div>
                                    <ArrowUpRight size={20} className="text-neutral-400 transition group-hover:text-[#FF3B00]" />
                                </div>

                                <div className="mt-4 flex items-end justify-between border-t border-neutral-100 pt-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                                            Current Bid
                                        </p>
                                        <p className="text-2xl font-black text-[#FF3B00]">
                                            ₹{auction.currentPrice.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right text-xs text-neutral-500">
                                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium uppercase">
                                            {auction.status}
                                        </span>
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