import { ArrowUpRight } from "lucide-react";

function AboutSection() {
    return (
        <section className="border-y border-neutral-300 py-32">
            <div className="mx-auto grid max-w-7xl gap-20 px-8 lg:grid-cols-2">
                {/* Left */}

                <div>
                    <p className="mb-4 uppercase tracking-[0.35em] text-[#FF3B00]">
                        Featured Auction
                    </p>

                    <h2
                        className="text-7xl leading-none uppercase"
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

                <div className="space-y-10">
                    <p className="text-2xl leading-10 text-neutral-700">
                        Bidding Wars brings together collectors, enthusiasts,
                        and premium sellers through live auctions designed for
                        speed, excitement, and transparency.
                    </p>

                    <div className="grid grid-cols-2 gap-10 border-t border-neutral-300 pt-10">
                        <div>
                            <h3 className="text-5xl font-bold">2K+</h3>
                            <p className="mt-2 text-neutral-500">
                                Live Auctions
                            </p>
                        </div>

                        <div>
                            <h3 className="text-5xl font-bold">18K+</h3>
                            <p className="mt-2 text-neutral-500">
                                Active Users
                            </p>
                        </div>

                        <div>
                            <h3 className="text-5xl font-bold">₹8.5M</h3>
                            <p className="mt-2 text-neutral-500">
                                Total Sales
                            </p>
                        </div>

                        <div>
                            <h3 className="text-5xl font-bold">99%</h3>
                            <p className="mt-2 text-neutral-500">
                                Verified Sellers
                            </p>
                        </div>
                    </div>

                    <button className="mt-6 flex items-center gap-3 border-b-2 border-[#FF3B00] pb-2 text-lg font-medium text-[#FF3B00]">
                        Explore Marketplace

                        <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AboutSection;