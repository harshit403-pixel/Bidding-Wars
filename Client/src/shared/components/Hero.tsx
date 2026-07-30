import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

function Hero() {
    return (
        <section className="relative overflow-hidden border-b border-neutral-200">
            <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl flex-col justify-center px-8 py-20">


                <h1
                    className="leading-[0.82] font-black uppercase"
                    style={{
                        fontFamily: "Bebas Neue",
                        fontSize: "clamp(6rem,18vw,16rem)",
                    }}
                >
                    BIDDING
                 
                    WARS
                </h1>

                <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_420px]">

                    {/* Left */}

                    <div>
                        <p className="max-w-xl text-xl leading-9 text-neutral-600">
                            Discover curated luxury products, rare collectibles,
                            sneakers, electronics and premium fashion in
                            real-time auctions where every second matters.
                        </p>

                        <div className="mt-10 flex gap-6">

                            <Link
                                to="/auctions"
                                className="inline-flex items-center gap-3 border-b-2 border-[#FF3B00] pb-2 text-lg font-medium text-[#FF3B00]"
                            >
                                Explore Auctions
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/register"
                                className="text-lg text-neutral-500 transition hover:text-black"
                            >
                                Create Account
                            </Link>

                        </div>
                    </div>

                    {/* Right */}

                    <div className="space-y-6">

                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200"
                            alt=""
                            className="aspect-square w-full object-cover"
                        />

                        <div className="flex items-end justify-between">

                            <div>

                                <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                                    Featured Auction
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    Nike Air Jordan
                                </h2>

                            </div>

                            <div className="text-right">

                                <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                                    Current Bid
                                </p>

                                <h2 className="mt-2 text-4xl font-bold text-[#FF3B00]">
                                    ₹12,500
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default Hero;