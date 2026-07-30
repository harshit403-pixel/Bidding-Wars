import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

function Footer() {
    return (
        <footer className="border-t border-neutral-300 bg-[#F5F1EB]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

                <div className="mt-12 grid gap-8 pt-10 sm:mt-16 sm:gap-12 sm:pt-14 md:grid-cols-4">
                    <div>
                        <h3 className="mb-3 text-base font-semibold sm:mb-5 sm:text-lg">
                            About
                        </h3>

                        <p className="text-sm leading-6 text-neutral-600 sm:leading-8">
                            Experience live auctions for premium products,
                            collectibles and exclusive finds from verified
                            sellers.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-3 text-base font-semibold sm:mb-5 sm:text-lg">
                            Marketplace
                        </h3>

                        <div className="space-y-2 text-sm sm:space-y-4">
                            <Link to="/auctions" className="block hover:text-[#FF3B00]">
                                Live Auctions
                            </Link>

                            <Link to="/auctions" className="block hover:text-[#FF3B00]">
                                Categories
                            </Link>

                            <Link to="/dashboard" className="block hover:text-[#FF3B00]">
                                Dashboard
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-3 text-base font-semibold sm:mb-5 sm:text-lg">
                            Company
                        </h3>

                        <div className="space-y-2 text-sm sm:space-y-4">
                            <a href="#">About</a>
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                            <a href="#">Support</a>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-3 text-base font-semibold sm:mb-5 sm:text-lg">
                            Connect
                        </h3>

                        <button className="flex items-center gap-2 border-b border-[#FF3B00] pb-1.5 text-sm text-[#FF3B00] sm:gap-3 sm:pb-2">
                            Join Live Auction

                            <ArrowUpRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="mt-10 flex flex-col justify-between gap-3 border-t border-neutral-300 pt-6 pb-6 text-xs text-neutral-500 sm:mt-16 sm:gap-4 sm:pt-8 sm:pb-8 sm:text-sm md:flex-row">
                    <p>© 2026 Bidding Wars. All rights reserved.</p>

                    <p>Designed for competitive real-time auctions.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
