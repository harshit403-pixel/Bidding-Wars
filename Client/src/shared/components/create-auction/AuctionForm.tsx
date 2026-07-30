import CategorySelector from "./categorySelector";
import PricingSection from "./PricingSection";
import ScheduleSection from "./ScheduleSection";


function AuctionForm() {
    return (
        <section className="space-y-10 border border-neutral-300 bg-white p-8">

            <div>

                <label>Title</label>

                <input
                    className="mt-3 w-full border border-neutral-300 p-4"
                    placeholder="Rolex Submariner"
                />

            </div>

            <div>

                <label>Description</label>

                <textarea
                    rows={6}
                    className="mt-3 w-full border border-neutral-300 p-4"
                />

            </div>

            <CategorySelector />

            <PricingSection />

            <ScheduleSection />

        </section>
    );
}

export default AuctionForm;