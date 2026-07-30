import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

function DashboardHeader() {
    return (
        <section className="border-b border-neutral-300 bg-[#F5F1EB]">
            <div className="mx-auto flex max-w-7xl flex-col gap-10 px-8 py-16 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="uppercase tracking-[0.35em] text-[#FF3B00]">
                        Seller Dashboard
                    </p>

                    <h1
                        className="mt-3 uppercase leading-none text-[#111111]"
                        style={{
                            fontFamily: "Bebas Neue",
                            fontSize: "clamp(4rem,10vw,8rem)",
                        }}
                    >
                        Dashboard
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">
                        Track your active auctions, monitor bids, manage your
                        listings, and stay updated with everything happening in
                        your marketplace.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Link
                        to="/marketplace"
                        className="border border-neutral-900 px-6 py-3 transition hover:bg-neutral-900 hover:text-white"
                    >
                        Explore Auctions
                    </Link>

                    <Link
                        to="/create-auction"
                        className="flex items-center gap-2 bg-[#111111] px-6 py-3 text-white transition hover:bg-[#FF3B00]"
                    >
                        Create Auction

                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default DashboardHeader;