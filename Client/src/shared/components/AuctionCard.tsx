import { ArrowUpRight } from "lucide-react";

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
}: AuctionCardProps) {
    return (
        <article className="group cursor-pointer">
            <div className="overflow-hidden bg-neutral-200">
                <img
                    src={image}
                    alt={title}
                    className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                />
            </div>

            <div className="mt-3 flex items-start justify-between sm:mt-5">
                <div>
                    <h3 className="text-lg font-semibold sm:text-2xl">{title}</h3>

                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500 sm:mt-2 sm:text-sm sm:tracking-[0.25em]">
                        {seller}
                    </p>
                </div>

                <ArrowUpRight
                    size={18}
                    className="mt-0.5 transition group-hover:text-[#FF3B00] sm:mt-1 sm:size-[22px]"
                />
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-neutral-300 pt-4 sm:mt-6 sm:pt-5">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">
                        Current Bid
                    </p>

                    <h4 className="mt-0.5 text-xl font-bold text-[#FF3B00] sm:mt-1 sm:text-3xl">
                        ₹{currentBid.toLocaleString()}
                    </h4>
                </div>

                <div className="text-right text-xs text-neutral-500 sm:text-sm">
                    <p>{watchers} Watching</p>
                    <p>{bids} Bids</p>
                </div>
            </div>
        </article>
    );
}

export default AuctionCard;
