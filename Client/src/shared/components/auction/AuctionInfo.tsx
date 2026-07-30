import { Clock3, Eye, Gavel, ShieldCheck } from "lucide-react";

function AuctionInfo() {
    return (
        <div>

            <p className="uppercase tracking-[0.35em] text-[#FF3B00]">
                Live Auction
            </p>

            <h1
                className="mt-3 uppercase leading-none"
                style={{
                    fontFamily: "Bebas Neue",
                    fontSize: "clamp(4rem,7vw,6.5rem)",
                }}
            >
                Rolex
                <br />
                Submariner
            </h1>

            <div className="mt-8 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white">
                    J
                </div>

                <div>
                    <p className="font-medium">John Anderson</p>

                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <ShieldCheck size={16} />

                        Verified Seller
                    </div>
                </div>

            </div>

            <p className="mt-10 text-lg leading-8 text-neutral-600">
                A timeless luxury watch renowned for its precision,
                craftsmanship and enduring value. This authenticated
                timepiece includes its original box, papers and
                manufacturer warranty.
            </p>

            <div className="mt-14 grid grid-cols-2 gap-8 border-y border-neutral-300 py-10">

                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                        Current Bid
                    </p>

                    <h2 className="mt-2 text-5xl font-bold">
                        ₹2,15,000
                    </h2>
                </div>

                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                        Ends In
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                        <Clock3 />

                        <span className="text-3xl font-semibold">
                            01:18:20
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Eye />

                    <span>328 Watching</span>
                </div>

                <div className="flex items-center gap-3">
                    <Gavel />

                    <span>1,942 Bids</span>
                </div>

            </div>

        </div>
    );
}

export default AuctionInfo;