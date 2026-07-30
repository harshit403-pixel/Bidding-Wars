import {
    Cpu,
    Gem,
    Gamepad2,
    Shirt,
    Car,
    Watch,
} from "lucide-react";

const categories = [
    {
        title: "Electronics",
        icon: Cpu,
    },
    {
        title: "Fashion",
        icon: Shirt,
    },
    {
        title: "Luxury",
        icon: Gem,
    },
    {
        title: "Gaming",
        icon: Gamepad2,
    },
    {
        title: "Watches",
        icon: Watch,
    },
    {
        title: "Vehicles",
        icon: Car,
    },
];

function Categories() {
    return (
        <section className="mx-auto mt-24 max-w-7xl px-6">
            <div className="mb-10 flex items-end justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-orange-500">
                        Browse
                    </p>

                    <h2 className="mt-2 text-4xl font-bold">
                        Popular Categories
                    </h2>
                </div>

                <button className="text-orange-400 transition hover:text-orange-300">
                    View All →
                </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {categories.map((category) => {
                    const Icon = category.icon;

                    return (
                        <button
                            key={category.title}
                            className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-orange-500 hover:bg-zinc-800"
                        >
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                                <Icon size={30} />
                            </div>

                            <h3 className="mt-6 text-lg font-semibold">
                                {category.title}
                            </h3>

                            <p className="mt-2 text-sm text-zinc-500">
                                Explore Auctions
                            </p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default Categories;