import {
    Search,
    Gavel,
    Trophy,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        icon: Search,
        title: "Discover",
        description:
            "Browse verified auctions across luxury watches, sneakers, electronics and collectibles.",
    },
    {
        icon: Gavel,
        title: "Place Your Bid",
        description:
            "Bid in real time against other collectors with complete transparency and live updates.",
    },
    {
        icon: Trophy,
        title: "Win & Own",
        description:
            "Secure your winning bid and complete checkout through our trusted marketplace.",
    },
];

function HowItWorks() {
    return (
        <section className="bg-[#FAFAFA] py-20">
            <div className="mx-auto max-w-7xl px-6">

                <div className="mx-auto mb-20 max-w-3xl text-center">

                    <span className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-[#FF5A1F]">
                        How It Works
                    </span>

                    <h2 className="mt-8 text-5xl font-black uppercase leading-none text-neutral-900 md:text-7xl">
                        Start Bidding
                        <br />
                        In Minutes.
                    </h2>

                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-500">
                        Join thousands of collectors and sellers on a marketplace
                        built for exciting, transparent and secure auctions.
                    </p>

                </div>

                <div className="grid gap-8 lg:grid-cols-3">

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.15,
                            }}
                            className="group rounded-[32px] bg-white p-10 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF5A1F] text-white">

                                <step.icon size={30} />

                            </div>

                            <span className="mt-10 block text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">
                                0{index + 1}
                            </span>

                            <h3 className="mt-5 text-3xl font-bold text-neutral-900">
                                {step.title}
                            </h3>

                            <p className="mt-5 leading-8 text-neutral-500">
                                {step.description}
                            </p>


                        </motion.div>
                    ))}

                </div>

            </div>
        </section>
    );
}

export default HowItWorks;