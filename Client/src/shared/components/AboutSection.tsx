import { ArrowUpRight } from "lucide-react";

function AboutSection() {
    return (
        <section className="border-y border-neutral-300 py-16 sm:py-24 md:py-32">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:gap-12 sm:px-6 md:gap-20 md:px-8 lg:grid-cols-2">
                {/* Left */}

                <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#FF3B00] sm:mb-4 sm:text-sm sm:tracking-[0.35em]">
                        Featured Auction
                    </p>

                    <h2
                        className="text-5xl uppercase sm:text-6xl md:text-7xl"
                        style={{ fontFamily: "Bebas Neue" }}
                    >
                        Every
                        <br />
                        Second
                        <br />
                        Counts
                    </h2>
                </div>

                {/* Right */}

                <div className="space-y-6 sm:space-y-10">
                    <p className="text-lg leading-8 text-neutral-700 sm:text-2xl sm:leading-10">
                        Bidding Wars brings together collectors, enthusiasts,
                        and premium sellers through live auctions designed for
                        speed, excitement, and transparency.
                    </p>

                    <div className="grid grid-cols-2 gap-6 border-t border-neutral-300 pt-6 sm:gap-10 sm:pt-10">
                        <div>
                            <h3 className="text-3xl font-bold sm:text-5xl">2K+</h3>
                            <p className="mt-1 text-xs text-neutral-500 sm:mt-2 sm:text-base">
                                Live Auctions
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold sm:text-5xl">18K+</h3>
                            <p className="mt-1 text-xs text-neutral-500 sm:mt-2 sm:text-base">
                                Active Users
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold sm:text-5xl">₹8.5M</h3>
                            <p className="mt-1 text-xs text-neutral-500 sm:mt-2 sm:text-base">
                                Total Sales
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold sm:text-5xl">99%</h3>
                            <p className="mt-1 text-xs text-neutral-500 sm:mt-2 sm:text-base">
                                Verified Sellers
                            </p>
                        </div>
                    </div>

                    <button className="mt-4 flex items-center gap-2 border-b-2 border-[#FF3B00] pb-1.5 text-base font-medium text-[#FF3B00] sm:mt-6 sm:gap-3 sm:pb-2 sm:text-lg">
                        Explore Marketplace

                        <ArrowUpRight size={16} className="sm:size-[18px]" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AboutSection;
