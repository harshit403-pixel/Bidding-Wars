import { Link } from "react-router";
import { motion } from "framer-motion";
import heroVideo from "../../assets/hero.mp4";

function Hero() {
    return (
        <section className="relative flex min-h-screen items-center overflow-hidden">
            {/* Background Video */}
            <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 h-full w-full object-cover"
>
    <source src={heroVideo} type="video/mp4" />
</video>

            {/* Overlay */}
           <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-between gap-16 px-6 pt-70 pb-24 lg:flex-row lg:items-end">

                {/* Left */}

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .8 }}
                    className="max-w-3xl"
                >
                    <div className="mb-2 inline-flex items-center gap-2  px-4 py-2 text-sm text-white ">
                       
                        Live Auctions Happening Now
                    </div>

                    <h1 className="text-6xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-8xl xl:text-[9rem]">
                       
                        RARE
                        <br />
                        ITEMS.
                    </h1>
                </motion.div>

                {/* Right */}

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .2, duration: .8 }}
                    className="max-w-md"
                >
                    <p className="mb-8 text-lg leading-8 text-white/80">
                        Experience premium real time auctions where collectors,
                        creators and sellers connect through transparent,
                        competitive bidding.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/auctions"
                            className="rounded-full bg-white px-7 py-4 font-semibold text-black transition hover:scale-105"
                        >
                            Explore Auctions
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-full border border-white/30 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20"
                        >
                            Start Selling
                        </Link>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-8">

                        <div>
                            <h3 className="text-3xl font-bold text-white">
                                10K+
                            </h3>

                            <p className="mt-1 text-sm text-white/60">
                                Collectors
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold text-white">
                                5K+
                            </h3>

                            <p className="mt-1 text-sm text-white/60">
                                Auctions
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold text-white">
                                24/7
                            </h3>

                            <p className="mt-1 text-sm text-white/60">
                                Live Bidding
                            </p>
                        </div>

                    </div>
                </motion.div>

            </div>
        </section>
    );
}

export default Hero;