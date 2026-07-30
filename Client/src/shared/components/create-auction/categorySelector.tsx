import { AUCTION_CATEGORIES } from "../../../features/auction/auction.types";

interface CategorySelectorProps {
    value: string;
    onChange: (value: string) => void;
}

function CategorySelector({ value, onChange }: CategorySelectorProps) {
    return (
        <section>
            <h3
                className="mb-6 text-3xl uppercase"
                style={{ fontFamily: "Bebas Neue" }}
            >
                Category
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {AUCTION_CATEGORIES.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => onChange(category)}
                        className={`border px-5 py-4 text-left text-sm transition ${
                            value === category
                                ? "border-[#FF3B00] bg-[#FF3B00] text-white"
                                : "border-neutral-300 bg-white hover:border-[#FF3B00]"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default CategorySelector;