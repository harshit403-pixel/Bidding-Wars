import { ArrowUpRight, Clock, Eye, Gavel } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/formatCurrency";

type AuctionCardProps = {
    title: string;
    image: string;
    currentBid: number;
    seller: string;
    watchers: number;
    bids: number;
    timeLeft: string;
};

function AuctionCard({
    title,
    image,
    currentBid,
    seller,
    watchers,
    bids,
    timeLeft,
}: AuctionCardProps) {
    return (
        <motion.article
            whileHover={{ y: -8 }}
            transition={{ duration: 0.25 }}
            className="group overflow-hidden rounded-[32px] bg-white shadow-sm transition hover:shadow-2xl"
        >
            <div className="relative overflow-hidden">

                <img
                    src={image}
                    alt={title}
                    className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute left-5 top-5 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                    LIVE
                </div>

                <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-white/20 px-3 py-2 text-sm text-white backdrop-blur-xl">
                    <Clock size={15} />
                    {timeLeft}
                </div>

                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/15 p-4 backdrop-blur-xl min-w-0">

                    <p className="text-xs uppercase tracking-widest text-white/70">
                        Current Bid
                    </p>

                    <h3 className="mt-1 text-3xl font-bold text-white truncate" title={`₹${currentBid.toLocaleString()}`}>
                        {formatCurrency(currentBid)}
                    </h3>

                </div>

            </div>

            <div className="p-6">

                <div className="flex items-start justify-between">

                    <div>

                        <h3 className="text-2xl font-bold text-neutral-900">
                            {title}
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500">
                            by {seller}
                        </p>

                    </div>

                    <div className="rounded-full bg-neutral-100 p-3 transition group-hover:bg-[#FF5A1F] group-hover:text-white">
                        <ArrowUpRight size={18} />
                    </div>

                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-5">

                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Eye size={16} />
                        {watchers} Watching
                    </div>

                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Gavel size={16} />
                        {bids} Bids
                    </div>

                </div>

            </div>

        </motion.article>
    );
}

export default AuctionCard;