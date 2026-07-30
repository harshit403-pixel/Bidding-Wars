import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

function Footer() {
    return (
        <footer className="border-t border-neutral-300 bg-[#F5F1EB]">
            <div className="mx-auto max-w-7xl px-8 ">

                <div className="mt-20 grid gap-12 pt-14 md:grid-cols-4">
                    <div>
                        <h3 className="mb-5 text-lg font-semibold">
                            About
                        </h3>

                        <p className="leading-8 text-neutral-600">
                            Experience live auctions for premium products,
                            collectibles and exclusive finds from verified
                            sellers.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-5 text-lg font-semibold">
                            Marketplace
                        </h3>

                        <div className="space-y-4">
                            <Link to="/auctions" className="block hover:text-[#FF3B00]">
                                Live Auctions
                            </Link>

                            <Link to="/categories" className="block hover:text-[#FF3B00]">
                                Categories
                            </Link>

                            <Link to="/dashboard" className="block hover:text-[#FF3B00]">
                                Dashboard
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-5 text-lg font-semibold">
                            Company
                        </h3>

                        <div className="space-y-4">
                            <a href="#">About</a>
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                            <a href="#">Support</a>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-5 text-lg font-semibold">
                            Connect
                        </h3>

                        <button className="flex items-center gap-3 border-b border-[#FF3B00] pb-2 text-[#FF3B00]">
                            Join Live Auction

                            <ArrowUpRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="mt-16 flex flex-col justify-between gap-4 border-t border-neutral-300 pt-8 pb-8 text-sm text-neutral-500 md:flex-row">
                    <p>© 2026 Bidding Wars. All rights reserved.</p>

                    <p>Designed for competitive real-time auctions.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;