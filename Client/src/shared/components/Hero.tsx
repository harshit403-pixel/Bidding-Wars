import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

function Hero() {
    return (
        <section className="relative overflow-hidden border-b border-neutral-200">
            <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col justify-center px-4 py-12 sm:min-h-[calc(100vh-80px)] sm:px-6 sm:py-16 md:min-h-[calc(100vh-96px)] md:px-8 md:py-20">


                <h1
                    className="leading-[0.82] font-black uppercase"
                    style={{
                        fontFamily: "Bebas Neue",
                        fontSize: "clamp(3.5rem,18vw,16rem)",
                    }}
                >
                    BIDDING
                 
                    WARS
                </h1>

                <div className="mt-8 grid gap-8 sm:mt-12 sm:gap-12 lg:grid-cols-[1.2fr_420px]">

                    {/* Left */}

                    <div>
                        <p className="max-w-xl text-base leading-7 text-neutral-600 sm:text-xl sm:leading-9">
                            Discover curated luxury products, rare collectibles,
                            sneakers, electronics and premium fashion in
                            real-time auctions where every second matters.
                        </p>

                        <div className="mt-6 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:gap-6">

                            <Link
                                to="/auctions"
                                className="inline-flex w-fit items-center gap-2 border-b-2 border-[#FF3B00] pb-1.5 text-base font-medium text-[#FF3B00] sm:gap-3 sm:pb-2 sm:text-lg"
                            >
                                Explore Auctions
                                <ArrowRight size={16} className="sm:size-[18px]" />
                            </Link>

                            <Link
                                to="/register"
                                className="text-base text-neutral-500 transition hover:text-black sm:text-lg"
                            >
                                Create Account
                            </Link>

                        </div>
                    </div>

                    {/* Right */}

                    <div className="space-y-4 sm:space-y-6">

                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200"
                            alt=""
                            className="aspect-square w-full object-cover"
                        />

                        <div className="flex items-end justify-between">

                            <div>

                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-sm sm:tracking-[0.25em]">
                                    Featured Auction
                                </p>

                                <h2 className="mt-1 text-xl font-bold sm:mt-2 sm:text-3xl">
                                    Nike Air Jordan
                                </h2>

                            </div>

                            <div className="text-right">

                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-sm sm:tracking-[0.25em]">
                                    Current Bid
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-[#FF3B00] sm:mt-2 sm:text-4xl">
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
