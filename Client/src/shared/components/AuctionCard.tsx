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

            <div className="mt-5 flex items-start justify-between">
                <div>
                    <h3 className="text-2xl font-semibold">{title}</h3>

                    <p className="mt-2 text-sm uppercase tracking-[0.25em] text-neutral-500">
                        {seller}
                    </p>
                </div>

                <ArrowUpRight
                    size={22}
                    className="transition group-hover:text-[#FF3B00]"
                />
            </div>

            <div className="mt-6 flex items-end justify-between border-t border-neutral-300 pt-5">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                        Current Bid
                    </p>

                    <h4 className="mt-1 text-3xl font-bold text-[#FF3B00]">
                        ₹{currentBid.toLocaleString()}
                    </h4>
                </div>

                <div className="text-right text-sm text-neutral-500">
                    <p>{watchers} Watching</p>
                    <p>{bids} Bids</p>
                </div>
            </div>
        </article>
    );
}

export default AuctionCard;