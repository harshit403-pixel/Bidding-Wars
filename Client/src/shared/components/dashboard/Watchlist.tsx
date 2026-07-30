const watchlist = [
    "Rolex Daytona",
    "PlayStation 5",
    "Air Jordan",
];

function Watchlist() {
    return (
        <section className="border border-neutral-300 bg-white p-8">
            <h2
                className="mb-8 text-5xl uppercase"
                style={{ fontFamily: "Bebas Neue" }}
            >
                Watchlist
            </h2>

            <div className="space-y-5">
                {watchlist.map((item) => (
                    <div
                        key={item}
                        className="flex items-center justify-between border-b border-neutral-200 pb-4"
                    >
                        <span>{item}</span>

                        <span className="text-[#FF3B00]">
                            ♥
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Watchlist;