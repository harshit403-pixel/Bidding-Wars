import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

function AboutSection() {
    return (
        <section className="bg-white py-32">
            <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-[0.9fr_1.1fr]">

                {/* Left */}

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                 

                    <h2 className="mt-8 text-5xl font-black uppercase leading-[0.9] text-neutral-900 md:text-7xl">
                        Every
                        <br />
                        Second
                        <br />
                        Counts.
                    </h2>

                    <p className="mt-8 max-w-md text-lg leading-8 text-neutral-500">
                        Experience a marketplace built for collectors, sellers
                        and enthusiasts where every bid happens live, securely
                        and transparently.
                    </p>

                   
                </motion.div>

                {/* Right */}

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="grid gap-6 md:grid-cols-2"
                >
                    <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-8">
                        <h3 className="text-5xl font-black text-neutral-900">
                            2K+
                        </h3>

                        <p className="mt-3 text-neutral-500">
                            Live auctions hosted every month.
                        </p>
                    </div>

                    <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-8">
                        <h3 className="text-5xl font-black text-neutral-900">
                            18K+
                        </h3>

                        <p className="mt-3 text-neutral-500">
                            Active collectors and bidders.
                        </p>
                    </div>

                    <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-8">
                        <h3 className="text-5xl font-black text-neutral-900">
                            ₹8.5M+
                        </h3>

                        <p className="mt-3 text-neutral-500">
                            Worth of successful auction sales.
                        </p>
                    </div>

                    <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-8">
                        <h3 className="text-5xl font-black text-neutral-900">
                            99%
                        </h3>

                        <p className="mt-3 text-neutral-500">
                            Verified sellers with trusted identities.
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

export default AboutSection;