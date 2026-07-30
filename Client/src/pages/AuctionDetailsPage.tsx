
import AuctionGallery from "../shared/components/auction/AuctionGallery";
import AuctionInfo from "../shared/components/auction/AuctionInfo";
import BidHistory from "../shared/components/auction/BigHistory";
import LiveBiddingPanel from "../shared/components/auction/LiveBiddingPanel";
import LiveChat from "../shared/components/auction/LiveChat";

function AuctionDetailsPage() {
    return (
        <main className="min-h-screen bg-[#F5F1EB]">
            <section className="mx-auto max-w-7xl px-8 py-16">
                <div className="grid gap-20 lg:grid-cols-[1.2fr_0.8fr]">
                    <AuctionGallery />

                    <div className="space-y-10">
                        <AuctionInfo />
                        <LiveBiddingPanel />
                    </div>
                </div>

                <div className="mt-24 grid gap-20 lg:grid-cols-[1.3fr_0.7fr]">
                    <BidHistory />
                    <LiveChat />
                </div>
            </section>
        </main>
    );
}

export default AuctionDetailsPage;