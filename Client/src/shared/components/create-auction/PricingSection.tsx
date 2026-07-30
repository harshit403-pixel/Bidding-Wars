function PricingSection() {
    return (
        <section>

            <h3 className="mb-6 text-3xl font-semibold">
                Pricing
            </h3>

            <div className="grid gap-6 md:grid-cols-2">

                <input
                    placeholder="Starting Bid"
                    className="border border-neutral-300 p-4"
                />

                <input
                    placeholder="Reserve Price"
                    className="border border-neutral-300 p-4"
                />

                <input
                    placeholder="Bid Increment"
                    className="border border-neutral-300 p-4"
                />

            </div>

        </section>
    );
}

export default PricingSection;