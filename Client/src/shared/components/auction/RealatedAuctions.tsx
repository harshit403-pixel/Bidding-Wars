import AuctionCard from "../AuctionCard";

const relatedAuctions = [
    {
        id: 1,
        title: "Omega Speedmaster",
        category: "Luxury Watch",
        price: "₹1,92,000",
        image:
            "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=900",
    },
    {
        id: 2,
        title: "TAG Heuer Carrera",
        category: "Luxury Watch",
        price: "₹1,48,000",
        image:
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=900",
    },
    {
        id: 3,
        title: "Breitling Navitimer",
        category: "Luxury Watch",
        price: "₹2,84,000",
        image:
            "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=900",
    },
];

function RelatedAuctions() {
    return (
        <section className="mt-32 border-t border-neutral-300 pt-20">

            <div className="mb-14 flex items-end justify-between">

                <div>

                    <p className="uppercase tracking-[0.35em] text-[#FF3B00]">
                        You May Like
                    </p>

                    <h2
                        className="mt-2 text-7xl uppercase leading-none"
                        style={{ fontFamily: "Bebas Neue" }}
                    >
                        Related
                        <br />
                        Auctions
                    </h2>

                </div>

                <button className="border-b border-black pb-1 hover:text-[#FF3B00]">
                    View Marketplace
                </button>

            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                {relatedAuctions.map((auction) => (
                    <AuctionCard
                        key={auction.id}
                        title={auction.title}
                        image={auction.image} currentBid={0} seller={""} watchers={0} bids={0} timeLeft={""}                    />
                ))}

            </div> 

        </section>
    );
}

export default RelatedAuctions;