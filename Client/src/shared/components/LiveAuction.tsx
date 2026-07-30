import {
    ArrowUpRight,
    BadgeCheck,
    Clock3,
    Eye,
    Gavel,
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

function LiveAuction() {
    return (
        <section className="bg-[#F8F8F8] py-32">
            <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-[1.15fr_0.85fr]">

                {/* Left */}

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative overflow-hidden rounded-[40px]"
                >

                    <img
                        src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1600"
                        alt="Rolex Submariner"
                        className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                    {/* Live Badge */}

                    <div className="absolute left-7 top-7 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-lg">
                        ● LIVE
                    </div>

                    {/* Category */}

                    <div className="absolute right-7 top-7 rounded-full bg-white/15 px-5 py-2 text-sm text-white backdrop-blur-xl">
                        Luxury Watch
                    </div>

                    {/* Watching */}

                    <div className="absolute right-7 bottom-7 flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm text-white backdrop-blur-xl">
                        <Eye size={16} />
                        124 Watching
                    </div>

                    {/* Bid Card */}

                    <div className="absolute bottom-7 left-7 rounded-3xl bg-white/15 p-6 backdrop-blur-xl">

                        <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                            Current Bid
                        </p>

                        <h2 className="mt-2 text-5xl font-bold text-white">
                            ₹2,15,000
                        </h2>

                    </div>

                </motion.div>

                {/* Right */}

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >


                    <h2 className="mt-8 text-6xl font-black uppercase leading-none text-neutral-900 md:text-7xl">
                        Rolex
                        <br />
                        Submariner
                    </h2>

                    <p className="mt-8 max-w-lg text-lg leading-8 text-neutral-500">
                        One of the world's most sought after luxury watches.
                        Join collectors worldwide in this exclusive live auction
                        before the countdown reaches zero.
                    </p>

                    {/* Seller */}

                    <div className="mt-10 flex items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">

                        <img
                            src="https://i.pravatar.cc/100?img=12"
                            alt="Seller"
                            className="h-14 w-14 rounded-full object-cover"
                        />

                        <div>

                            <div className="flex items-center gap-2">

                                <h4 className="font-semibold text-neutral-900">
                                    Luxury Vault
                                </h4>

                                <BadgeCheck
                                    size={18}
                                    className="text-blue-500"
                                />

                            </div>

                            <p className="text-sm text-neutral-500">
                                2,450 Successful Sales • 4.9 Rating
                            </p>

                        </div>

                    </div>

                    {/* Stats */}
                                        <div className="mt-12 grid grid-cols-2 gap-5">

                        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <Clock3
                                size={22}
                                className="text-[#FF5A1F]"
                            />

                            <p className="mt-5 text-sm text-neutral-500">
                                Time Left
                            </p>

                            <h3 className="mt-2 text-3xl font-bold text-neutral-900">
                                01:18:42
                            </h3>
                        </div>

                        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <Eye
                                size={22}
                                className="text-[#FF5A1F]"
                            />

                            <p className="mt-5 text-sm text-neutral-500">
                                Watching
                            </p>

                            <h3 className="mt-2 text-3xl font-bold text-neutral-900">
                                287
                            </h3>
                        </div>

                        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <Gavel
                                size={22}
                                className="text-[#FF5A1F]"
                            />

                            <p className="mt-5 text-sm text-neutral-500">
                                Total Bids
                            </p>

                            <h3 className="mt-2 text-3xl font-bold text-neutral-900">
                                1,946
                            </h3>
                        </div>

                        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">

                            <p className="text-2xl">🏆</p>

                            <p className="mt-5 text-sm text-neutral-500">
                                Highest Bidder
                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-neutral-900">
                                Alex Morgan
                            </h3>

                        </div>

                    </div>

                    <div className="mt-12 flex flex-wrap gap-4">

                        <Link
                            to="/auction/1"
                            className="inline-flex items-center gap-3 rounded-full bg-[#FF5A1F] px-8 py-4 font-semibold text-white transition duration-300 hover:scale-105"
                        >
                            Join Live Auction

                            <ArrowUpRight size={18} />
                        </Link>

                        <button className="rounded-full border border-neutral-300 bg-white px-8 py-4 font-semibold text-neutral-900 transition duration-300 hover:bg-neutral-100">
                            View Details
                        </button>

                    </div>

                </motion.div>

            </div>
        </section>
    );
}

export default LiveAuction;