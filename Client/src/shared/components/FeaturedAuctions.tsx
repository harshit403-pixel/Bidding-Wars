import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import AuctionCard from "./AuctionCard";

const auctions = [
    {
        id: 1,
        title: "Nike Air Jordan",
        image: "https://thelastape.in/cdn/shop/files/53.jpg?v=1714140246",
        currentBid: 12500,
        seller: "SneakerHub",
        watchers: 285,
        bids: 43,
        timeLeft: "02:15:24",
    },
    {
        id: 2,
        title: "Rolex Submariner",
        image: "https://media.rolex.com/image/upload/q_auto/f_auto/c_limit,w_1920/v1775305335/rolexcom/094398bf1f99/navigation/professional-watches-sea-dweller-navigation-portrait",
        currentBid: 185000,
        seller: "Luxury Vault",
        watchers: 142,
        bids: 31,
        timeLeft: "05:42:10",
    },
    {
        id: 3,
        title: "MacBook Pro M4",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwgo_krNNmepsuZwnhp680fy50HBggDrYfYDIgqmzarNfPadIQ3jSxdn2f&s=10",
        currentBid: 98000,
        seller: "Apple Store",
        watchers: 91,
        bids: 14,
        timeLeft: "09:14:50",
    },
];

function FeaturedAuctions() {
    return (
        <section className="bg-white py-28">
            <div className="mx-auto max-w-7xl px-6">

                <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

                    <div className="max-w-2xl">

                        

                        <h2 className="mt-6 text-5xl font-black uppercase leading-none text-neutral-900 md:text-7xl">
                            Bid On
                            <br />
                            Extraordinary
                            <br />
                            Items.
                        </h2>

                    </div>

                    <div className="max-w-md">

                        <p className="mb-8 text-lg leading-8 text-neutral-500">
                            Explore handpicked auctions featuring premium
                            collectibles, luxury goods, gadgets and rare finds
                            from verified sellers around the world.
                        </p>

                        <Link
                            to="/auctions"
                            className="inline-flex items-center gap-3 rounded-full bg-black/10 px-7 py-4 font-medium text-white transition hover:scale-105 hover:bg-[#FF5A1F]"
                        >
                            Explore Marketplace
                            <ArrowRight size={18} />
                        </Link>

                    </div>

                </div>

                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

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