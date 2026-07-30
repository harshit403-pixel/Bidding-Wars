import AuctionCard from "../AuctionCard";

const auctions = [
    {
        id: 1,
        title: "Rolex Daytona",
        category: "Luxury Watch",
        price: "₹2,45,000",
        image:
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900",
    },
    {
        id: 2,
        title: "MacBook Pro M4",
        category: "Electronics",
        price: "₹1,52,000",
        image:
            "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=900",
    },
    {
        id: 3,
        title: "Nike Air Jordan",
        category: "Sneakers",
        price: "₹18,500",
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
    },
    {
        id: 4,
        title: "PlayStation 5",
        category: "Gaming",
        price: "₹42,000",
        image:
            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=900",
    },
];

function MarketplaceGrid() {
    return (
        <section>

            <div className="mb-10 flex items-center justify-between">

                <p className="text-neutral-600">
                    Showing 24 Live Auctions
                </p>

                <select className="border border-neutral-300 bg-white px-4 py-2 outline-none">
                    <option>Newest</option>
                    <option>Ending Soon</option>
                    <option>Highest Bid</option>
                    <option>Most Popular</option>
                </select>

            </div>

            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">

                {auctions.map((auction) => (
                    <AuctionCard
                        key={auction.id}
                        title={auction.title} image={""} currentBid={0} seller={""} watchers={0} bids={0} timeLeft={""}                     
                    />
                ))}

            </div>

        </section>
    );
}

export default MarketplaceGrid;