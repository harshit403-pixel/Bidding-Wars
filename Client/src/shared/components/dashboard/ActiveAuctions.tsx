import { ArrowUpRight } from "lucide-react";

const auctions = [
    {
        id: 1,
        title: "Rolex Submariner",
        bid: "₹2,18,000",
        status: "LIVE",
    },
    {
        id: 2,
        title: "MacBook Pro M4",
        bid: "₹1,25,000",
        status: "LIVE",
    },
];

function ActiveAuctions() {
    return (
        <section className="border border-neutral-300 bg-white p-8">
            <h2 className="mb-8 text-5xl uppercase" style={{ fontFamily: "Bebas Neue" }}>
                Active Auctions
            </h2>

            <div className="space-y-6">
                {auctions.map((auction) => (
                    <div
                        key={auction.id}
                        className="flex items-center justify-between border-b border-neutral-200 pb-5"
                    >
                        <div>
                            <h3 className="text-xl font-semibold">
                                {auction.title}
                            </h3>

                            <p className="mt-2 text-[#FF3B00]">
                                {auction.status}
                            </p>
                        </div>

                        <div className="text-right">
                            <p>{auction.bid}</p>

                            <button className="mt-2 flex items-center gap-2 text-sm hover:text-[#FF3B00]">
                                Manage

                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ActiveAuctions;