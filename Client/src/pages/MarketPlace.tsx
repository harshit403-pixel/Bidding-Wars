import FiltersSidebar from "../shared/components/marketplace/FiltersSIdeBar";
import MarketplaceGrid from "../shared/components/marketplace/MarketPlaceGrid";
import MarketplaceHeader from "../shared/components/marketplace/MarketplaceHeader";


function MarketplacePage() {
    return (
        <main className="min-h-screen bg-[#F5F1EB]">

            <MarketplaceHeader />

            <section className="mx-auto grid max-w-7xl gap-12 px-8 py-16 lg:grid-cols-[280px_1fr]">

                <FiltersSidebar />

                <MarketplaceGrid />

            </section>

        </main>
    );
}

export default MarketplacePage;