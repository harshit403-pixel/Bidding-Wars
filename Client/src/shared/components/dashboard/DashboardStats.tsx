const stats = [
    {
        title: "Active Auctions",
        value: "12",
    },
    {
        title: "Winning Bids",
        value: "8",
    },
    {
        title: "Watchlist",
        value: "23",
    },
    {
        title: "Total Earnings",
        value: "₹4.8L",
    },
];

function DashboardStats() {
    return (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {stats.map((item) => (
                <div
                    key={item.title}
                    className="border border-neutral-300 bg-white p-8"
                >
                    <p className="text-neutral-500">
                        {item.title}
                    </p>

                    <h2 className="mt-4 text-5xl font-bold">
                        {item.value}
                    </h2>
                </div>
            ))}

        </section>
    );
}

export default DashboardStats;