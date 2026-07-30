const activities = [
    "You placed ₹2,18,000 on Rolex",
    "Someone outbid you on PS5",
    "Auction created successfully",
    "Auction won by you",
];

function ActivityTimeline() {
    return (
        <aside className="border border-neutral-300 bg-white p-8">
            <h2
                className="mb-8 text-5xl uppercase"
                style={{ fontFamily: "Bebas Neue" }}
            >
                Activity
            </h2>

            <div className="space-y-6">
                {activities.map((item) => (
                    <div
                        key={item}
                        className="border-l-2 border-[#FF3B00] pl-4"
                    >
                        {item}
                    </div>
                ))}
            </div>
        </aside>
    );
}

export default ActivityTimeline;