const bids = [
    {
        title: "Rolex",
        amount: "₹2,18,000",
        status: "Winning",
    },
    {
        title: "MacBook",
        amount: "₹1,10,000",
        status: "Outbid",
    },
];

function RecentBids() {
    return (
        <section className="border border-neutral-300 bg-white p-8">
            <h2
                className="mb-8 text-5xl uppercase"
                style={{ fontFamily: "Bebas Neue" }}
            >
                Recent Bids
            </h2>

            <div className="space-y-5">
                {bids.map((bid) => (
                    <div
                        key={bid.title}
                        className="flex items-center justify-between border-b border-neutral-200 pb-4"
                    >
                        <div>
                            <h3>{bid.title}</h3>

                            <p className="text-neutral-500">
                                {bid.status}
                            </p>
                        </div>

                        <strong>{bid.amount}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RecentBids;