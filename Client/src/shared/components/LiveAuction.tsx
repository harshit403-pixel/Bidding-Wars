import { ArrowUpRight } from "lucide-react";

function LiveAuction() {
    return (
        <section className="bg-[#111111] text-white">
            <div className="mx-auto grid max-w-7xl gap-20 px-8 py-28 lg:grid-cols-2">

                <div className="overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200"
                        alt="Rolex"
                        className="aspect-[4/5] h-full w-full object-cover"
                    />
                </div>

                <div className="flex flex-col justify-center">

                    <p className="mb-4 uppercase tracking-[0.35em] text-[#FF5A2C]">
                        ● LIVE NOW
                    </p>

                    <h2
                        className="uppercase leading-none"
                        style={{
                            fontFamily: "Bebas Neue",
                            fontSize: "clamp(5rem,11vw,9rem)",
                        }}
                    >
                        Rolex
                        <br />
                        Submariner
                    </h2>

                    <p className="mt-8 max-w-md text-lg leading-8 text-neutral-400">
                        A premium luxury watch currently attracting collectors
                        from around the world. Join the auction before time
                        runs out.
                    </p>

                    <div className="mt-14 grid grid-cols-2 gap-8">

                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                                Current Bid
                            </p>

                            <h3 className="mt-2 text-4xl font-semibold">
                                ₹2,15,000
                            </h3>
                        </div>

                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                                Ends In
                            </p>

                            <h3 className="mt-2 text-4xl font-semibold">
                                01:18:42
                            </h3>
                        </div>

                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                                Active Bidders
                            </p>

                            <h3 className="mt-2 text-4xl font-semibold">
                                287
                            </h3>
                        </div>

                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                                Total Bids
                            </p>

                            <h3 className="mt-2 text-4xl font-semibold">
                                1,946
                            </h3>
                        </div>

                    </div>

                    <button className="mt-16 flex w-fit items-center gap-3 border-b border-[#FF5A2C] pb-2 text-lg text-[#FF5A2C] transition hover:gap-5">
                        Join Auction

                        <ArrowUpRight size={18} />
                    </button>

                </div>

            </div>
        </section>
    );
}

export default LiveAuction;