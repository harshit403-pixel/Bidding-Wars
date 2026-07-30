const categories = [
    "Luxury Watches",
    "Sneakers",
    "Electronics",
    "Gaming",
    "Collectibles",
    "Fashion",
    "Art",
    "Vehicles",
];

function CategorySelector() {
    return (
        <section>
            <h3 className="mb-6 text-3xl font-semibold">
                Category
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        className="border border-neutral-300 bg-white px-5 py-4 text-left transition hover:border-black hover:bg-black hover:text-white"
                    >
                        {category}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default CategorySelector;