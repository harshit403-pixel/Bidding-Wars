interface PricingSectionProps {
    startingBid: string;
    minimumIncrement: string;
    onStartingBidChange: (value: string) => void;
    onMinimumIncrementChange: (value: string) => void;
}

function PricingSection({
    startingBid,
    minimumIncrement,
    onStartingBidChange,
    onMinimumIncrementChange,
}: PricingSectionProps) {
    return (
        <section>
            <h3
                className="mb-6 text-3xl uppercase"
                style={{ fontFamily: "Bebas Neue" }}
            >
                Pricing
            </h3>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-700">
                        Starting Bid ($)
                    </label>
                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={startingBid}
                        onChange={(e) =>
                            onStartingBidChange(e.target.value)
                        }
                        className="mt-2 w-full border border-neutral-300 bg-white p-4 outline-none transition focus:border-[#FF3B00]"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-700">
                        Min Increment ($)
                    </label>
                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={minimumIncrement}
                        onChange={(e) =>
                            onMinimumIncrementChange(e.target.value)
                        }
                        className="mt-2 w-full border border-neutral-300 bg-white p-4 outline-none transition focus:border-[#FF3B00]"
                        placeholder="1.00"
                    />
                </div>
            </div>
        </section>
    );
}

export default PricingSection;