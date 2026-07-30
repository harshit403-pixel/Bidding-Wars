import { ArrowUpRight, Clock3, Gavel, Users } from "lucide-react";

function LiveBiddingPanel() {
    return (
        <aside className="sticky top-8 border border-neutral-300 bg-white p-8">

            <div className="flex items-center justify-between">

                <div>
                    <p className="uppercase tracking-[0.3em] text-[#FF3B00]">
                        Live Auction
                    </p>

                    <h2
                        className="mt-2 text-5xl uppercase"
                        style={{ fontFamily: "Bebas Neue" }}
                    >
                        Bid Now
                    </h2>
                </div>

                <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />

            </div>

            <div className="mt-10 space-y-8">

                <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Highest Bid</span>

                    <h3 className="text-4xl font-bold">
                        ₹2,15,000
                    </h3>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Clock3 size={18} />
                        Time Left
                    </span>

                    <strong>01:17:42</strong>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Users size={18} />
                        Watching
                    </span>

                    <strong>328</strong>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Gavel size={18} />
                        Total Bids
                    </span>

                    <strong>1,942</strong>
                </div>

            </div>

            <div className="mt-10">

                <label className="text-sm uppercase tracking-[0.3em]">
                    Your Bid
                </label>

                <input
                    type="number"
                    placeholder="220000"
                    className="mt-3 w-full border border-neutral-300 px-5 py-4 text-xl outline-none"
                />

                <button className="mt-5 flex w-full items-center justify-center gap-3 bg-[#111111] py-5 uppercase tracking-[0.25em] text-white transition hover:bg-[#FF3B00]">
                    Place Bid

                    <ArrowUpRight size={18} />
                </button>

            </div>

            <div className="mt-10 border-t border-neutral-300 pt-8">

                <p className="mb-5 text-sm uppercase tracking-[0.3em]">
                    Suggested Bids
                </p>

                <div className="flex flex-wrap gap-3">

                    {[
                        "₹2,20,000",
                        "₹2,25,000",
                        "₹2,30,000",
                    ].map((amount) => (
                        <button
                            key={amount}
                            className="border border-neutral-300 px-5 py-2 transition hover:border-black hover:bg-black hover:text-white"
                        >
                            {amount}
                        </button>
                    ))}

                </div>

            </div>

        </aside>
    );
}

export default LiveBiddingPanel;