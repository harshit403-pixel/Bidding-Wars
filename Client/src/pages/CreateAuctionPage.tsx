import AuctionForm from "../shared/components/create-auction/AuctionForm";
import AuctionImages from "../shared/components/create-auction/AuctionImages";
import PreviewCard from "../shared/components/create-auction/PreviewCard";


function CreateAuctionPage() {
    return (
        <main className="min-h-screen bg-[#F5F1EB]">

            <section className="border-b border-neutral-300">

                <div className="mx-auto max-w-7xl px-8 py-16">

                    <p className="uppercase tracking-[0.35em] text-[#FF3B00]">
                        Seller Dashboard
                    </p>

                    <h1
                        className="mt-3 uppercase leading-none"
                        style={{
                            fontFamily: "Bebas Neue",
                            fontSize: "clamp(4rem,10vw,8rem)",
                        }}
                    >
                        Create
                        <br />
                        Auction
                    </h1>

                </div>

            </section>

            <section className="mx-auto grid max-w-7xl gap-20 px-8 py-16 lg:grid-cols-[1.2fr_0.8fr]">

                <div className="space-y-12">

                    <AuctionImages />

                    <AuctionForm />

                </div>

                <PreviewCard />

            </section>

        </main>
    );
}

export default CreateAuctionPage;