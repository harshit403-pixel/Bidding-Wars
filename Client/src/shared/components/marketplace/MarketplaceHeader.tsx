function MarketplaceHeader() {
    return (
        <section className="border-b border-neutral-300">

            <div className="mx-auto max-w-7xl px-8 py-20">

                <p className="uppercase tracking-[0.35em] text-[#FF3B00]">
                    Marketplace
                </p>

                <h1
                    className="mt-3 uppercase leading-none"
                    style={{
                        fontFamily: "Bebas Neue",
                        fontSize: "clamp(5rem,13vw,10rem)",
                    }}
                >
                    Explore
                    <br />
                    Auctions
                </h1>

                <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-600">
                    Browse live and upcoming auctions from verified sellers across
                    luxury watches, electronics, sneakers, collectibles and more.
                </p>

            </div>

        </section>
    );
}

export default MarketplaceHeader;