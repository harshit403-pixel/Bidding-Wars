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
        <section className="border-t border-neutral-200 py-12 sm:py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="mb-10 flex items-end justify-between sm:mb-16 md:mb-20">
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#FF3B00] sm:mb-3 sm:text-sm sm:tracking-[0.35em]">
                            Live Marketplace
                        </p>

                        <h2
                            className="text-4xl uppercase sm:text-5xl md:text-6xl"
                            style={{ fontFamily: "Bebas Neue" }}
                        >
                            Featured Auctions
                        </h2>
                    </div>

                    <button className="border-b border-black pb-0.5 text-sm transition hover:text-[#FF3B00] sm:pb-1">
                        View All
                    </button>
                </div>

                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
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
