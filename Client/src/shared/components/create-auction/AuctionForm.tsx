import CategorySelector from "./categorySelector";
import PricingSection from "./PricingSection";
import ScheduleSection from "./ScheduleSection";
import { ITEM_CONDITIONS } from "../../../features/auction/auction.types";
import type { AuctionFormData } from "../../../pages/CreateAuctionPage";

interface AuctionFormProps {
    form: AuctionFormData;
    onUpdateField: (field: keyof AuctionFormData, value: string) => void;
}

function AuctionForm({ form, onUpdateField }: AuctionFormProps) {
    return (
        <section className="space-y-8 border border-neutral-300 bg-white p-6 sm:space-y-10 sm:p-8">
            <div>
                <label className="text-xs font-medium uppercase tracking-wide text-neutral-700">
                    Title
                </label>
                <input
                    value={form.title}
                    onChange={(e) => onUpdateField("title", e.target.value)}
                    className="mt-3 w-full border border-neutral-300 bg-white p-4 outline-none transition focus:border-[#FF3B00]"
                    placeholder="Rolex Submariner"
                    maxLength={100}
                />
                <p className="mt-1 text-xs text-neutral-400">
                    {form.title.length}/100
                </p>
            </div>

            <div>
                <label className="text-xs font-medium uppercase tracking-wide text-neutral-700">
                    Description
                </label>
                <textarea
                    value={form.description}
                    onChange={(e) =>
                        onUpdateField("description", e.target.value)
                    }
                    rows={6}
                    className="mt-3 w-full border border-neutral-300 bg-white p-4 outline-none transition focus:border-[#FF3B00]"
                    placeholder="Describe your item in detail..."
                    maxLength={2000}
                />
                <p className="mt-1 text-xs text-neutral-400">
                    {form.description.length}/2000
                </p>
            </div>

            <CategorySelector
                value={form.category}
                onChange={(v) => onUpdateField("category", v)}
            />

            <section>
                <h3
                    className="mb-6 text-3xl uppercase"
                    style={{ fontFamily: "Bebas Neue" }}
                >
                    Condition
                </h3>
                <div className="flex flex-wrap gap-3">
                    {ITEM_CONDITIONS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => onUpdateField("condition", c)}
                            className={`border px-5 py-3 text-sm transition ${
                                form.condition === c
                                    ? "border-[#FF3B00] bg-[#FF3B00] text-white"
                                    : "border-neutral-300 bg-white hover:border-[#FF3B00]"
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </section>

            <PricingSection
                startingBid={form.startingBid}
                minimumIncrement={form.minimumIncrement}
                onStartingBidChange={(v) => onUpdateField("startingBid", v)}
                onMinimumIncrementChange={(v) =>
                    onUpdateField("minimumIncrement", v)
                }
            />

            <ScheduleSection
                startsAt={form.startsAt}
                endsAt={form.endsAt}
                onStartsAtChange={(v) => onUpdateField("startsAt", v)}
                onEndsAtChange={(v) => onUpdateField("endsAt", v)}
            />
        </section>
    );
}

export default AuctionForm;