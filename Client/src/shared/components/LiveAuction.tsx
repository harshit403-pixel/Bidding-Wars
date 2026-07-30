import { ArrowUpRight } from "lucide-react";

function LiveAuction() {
    return (
        <section className="bg-[#111111] text-white">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:gap-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">

                <div className="overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200"
                        alt="Rolex"
                        className="aspect-[4/5] h-full w-full object-cover"
                    />
                </div>

                <div className="flex flex-col justify-center">

                    <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#FF5A2C] sm:mb-4 sm:text-sm sm:tracking-[0.35em]">
                        ● LIVE NOW
                    </p>

                    <h2
                        className="uppercase leading-none"
                        style={{
                            fontFamily: "Bebas Neue",
                            fontSize: "clamp(3rem,11vw,9rem)",
                        }}
                    >
                        Rolex
                        <br />
                        Submariner
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-6 text-neutral-400 sm:mt-8 sm:text-lg sm:leading-8">
                        A premium luxury watch currently attracting collectors
                        from around the world. Join the auction before time
                        runs out.
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-14 sm:gap-8">

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 sm:text-sm sm:tracking-[0.3em]">
                                Current Bid
                            </p>

                            <h3 className="mt-1 text-2xl font-semibold sm:mt-2 sm:text-4xl">
                                ₹2,15,000
                            </h3>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 sm:text-sm sm:tracking-[0.3em]">
                                Ends In
                            </p>

                            <h3 className="mt-1 text-2xl font-semibold sm:mt-2 sm:text-4xl">
                                01:18:42
                            </h3>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 sm:text-sm sm:tracking-[0.3em]">
                                Active Bidders
                            </p>

                            <h3 className="mt-1 text-2xl font-semibold sm:mt-2 sm:text-4xl">
                                287
                            </h3>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 sm:text-sm sm:tracking-[0.3em]">
                                Total Bids
                            </p>

                            <h3 className="mt-1 text-2xl font-semibold sm:mt-2 sm:text-4xl">
                                1,946
                            </h3>
                        </div>

                    </div>

                    <button className="mt-8 flex w-fit items-center gap-2 border-b border-[#FF5A2C] pb-1.5 text-base text-[#FF5A2C] transition hover:gap-5 sm:mt-16 sm:gap-3 sm:pb-2 sm:text-lg">
                        Join Auction

                        <ArrowUpRight size={16} className="sm:size-[18px]" />
                    </button>

                </div>

            </div>
        </section>
    );
}

export default LiveAuction;
