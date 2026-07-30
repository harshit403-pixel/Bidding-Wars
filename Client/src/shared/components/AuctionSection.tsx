import AuctionCard from "./AuctionCard";

const auctions = [
    {
        id: 1,
        title: "Nike Air Jordan Retro",
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
        currentBid: 12500,
        seller: "SneakerHub",
        watchers: 285,
        bids: 43,
        timeLeft: "01:24:51",
    },
    {
        id: 2,
        title: "PlayStation 5 Pro",
        image:
            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200",
        currentBid: 38500,
        seller: "GameZone",
        watchers: 174,
        bids: 29,
        timeLeft: "03:18:42",
    },
    {
        id: 3,
        title: "Rolex Submariner",
        image:
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200",
        currentBid: 220000,
        seller: "LuxuryVault",
        watchers: 421,
        bids: 87,
        timeLeft: "00:42:15",
    },
    {
        id: 4,
        title: "MacBook Pro M4",
        image:
            "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
        currentBid: 98000,
        seller: "Apple Store",
        watchers: 203,
        bids: 34,
        timeLeft: "02:11:06",
    },
];

function AuctionSection() {
    return (
        <section className="mx-auto mt-24 max-w-7xl px-6 pb-24">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-orange-500">
                        Live Marketplace
                    </p>

                    <h2 className="mt-2 text-4xl font-bold">
                        Trending Auctions
                    </h2>

                    <p className="mt-3 max-w-xl text-zinc-400">
                        Join live auctions happening right now and compete with
                        bidders from around the world.
                    </p>
                </div>

                <button className="rounded-xl border border-zinc-700 px-6 py-3 font-medium transition hover:border-orange-500 hover:text-orange-400">
                    View All
                </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                {auctions.map((auction) => (
                    <AuctionCard
                        key={auction.id}
                        title={auction.title}
                        image={auction.image}
                        currentBid={auction.currentBid}
                        seller={auction.seller}
                        watchers={auction.watchers}
                        bids={auction.bids}
                        timeLeft={auction.timeLeft}
                    />
                ))}
            </div>
        </section>
    );
}

export default AuctionSection;