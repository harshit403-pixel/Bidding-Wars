const categories = [
    "Luxury Watches",
    "Sneakers",
    "Electronics",
    "Gaming",
    "Collectibles",
    "Fashion",
];

function FiltersSidebar() {
    return (
        <aside className="h-fit border border-neutral-300 bg-white p-6">

            <h2
                className="text-4xl uppercase"
                style={{ fontFamily: "Bebas Neue" }}
            >
                Filters
            </h2>

            <div className="mt-8">

                <p className="mb-4 font-medium">
                    Categories
                </p>

                <div className="space-y-3">

                    {categories.map((item) => (
                        <label
                            key={item}
                            className="flex items-center gap-3"
                        >
                            <input type="checkbox" />

                            {item}
                        </label>
                    ))}

                </div>

            </div>

            <button className="mt-10 w-full bg-[#111111] py-3 text-white hover:bg-[#FF3B00]">
                Apply Filters
            </button>

        </aside>
    );
}

export default FiltersSidebar;