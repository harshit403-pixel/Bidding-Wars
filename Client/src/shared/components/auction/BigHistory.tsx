const bids = [
    {
        user: "Harshit",
        amount: "₹2,15,000",
        time: "2 sec ago",
    },
    {
        user: "Rahul",
        amount: "₹2,10,000",
        time: "18 sec ago",
    },
    {
        user: "Ankit",
        amount: "₹2,05,000",
        time: "1 min ago",
    },
    {
        user: "Priya",
        amount: "₹2,00,000",
        time: "2 min ago",
    },
];

function BidHistory() {
    return (
        <section className="mt-24 border-t border-neutral-300 pt-16">

            <h2
                className="mb-10 text-6xl uppercase"
                style={{ fontFamily: "Bebas Neue" }}
            >
                Bid History
            </h2>

            <div className="space-y-6">

                {bids.map((bid) => (
                    <div
                        key={bid.amount}
                        className="flex items-center justify-between border-b border-neutral-200 pb-5"
                    >
                        <div>

                            <h3 className="text-xl font-semibold">
                                {bid.user}
                            </h3>

                            <p className="text-neutral-500">
                                {bid.time}
                            </p>

                        </div>

                        <span className="text-2xl font-bold text-[#FF3B00]">
                            {bid.amount}
                        </span>
                    </div>
                ))}

            </div>

        </section>
    );
}

export default BidHistory;