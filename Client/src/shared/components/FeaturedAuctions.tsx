import AuctionCard from "./AuctionCard";

const auctions = [
    {
        id: 1,
        title: "Nike Air Jordan",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
        currentBid: 12500,
        seller: "SneakerHub",
        watchers: 285,
        bids: 43,
        timeLeft: "02:15:24",
    },
    {
        id: 2,
        title: "Rolex Submariner",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200",
        currentBid: 185000,
        seller: "Luxury Vault",
        watchers: 142,
        bids: 31,
        timeLeft: "05:42:10",
    },
    {
        id: 3,
        title: "MacBook Pro M4",
        image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
        currentBid: 98000,
        seller: "Apple Store",
        watchers: 91,
        bids: 14,
        timeLeft: "09:14:50",
    },
];
function FeaturedAuctions() {
    return (
        <section className="border-t border-neutral-200 py-24">
            <div className="mx-auto max-w-7xl px-8">
                <div className="mb-20 flex items-end justify-between">
                    <div>
                        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#FF3B00]">
                            Live Marketplace
                        </p>

                        <h2
                            className="text-6xl uppercase"
                            style={{ fontFamily: "Bebas Neue" }}
                        >
                            Featured Auctions
                        </h2>
                    </div>

                    <button className="border-b border-black pb-1 transition hover:text-[#FF3B00]">
                        View All
                    </button>
                </div>

                <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                    {auctions.map((auction) => (
                        <AuctionCard
                            key={auction.id}
                            {...auction}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturedAuctions;