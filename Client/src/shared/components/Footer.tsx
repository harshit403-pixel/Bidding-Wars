import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import footerVideo from "../../assets/footer.mp4";

function Footer() {
    return (
        <footer className="relative  overflow-hidden">

            {/* Background Video */}

            <video
                autoPlay
                muted
                loop
                playsInline
                src={footerVideo}
                className="absolute inset-0 h-full w-full object-cover object-top"
            />

            {/* Overlay */}


            {/* Content */}

            <div className="relative z-10">

                {/* CTA */}


                {/* Floating Footer Card */}

                <section className="mt-90 px-6 pb-8">

                    <div className="mx-auto max-w-7xl rounded-[48px] border border-white/10 bg-[#F6F4EF]/95 p-12 shadow-2xl backdrop-blur-xl">

                        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">

                            {/* Brand */}

                            <div className="lg:col-span-1">

                                <h3 className="text-3xl font-black leading-none">
                                    Bidding
                                    <br />
                                    Wars
                                </h3>

                                <p className="mt-6 leading-7 text-neutral-600">
                                    Experience modern live auctions for luxury
                                    goods, electronics and collectibles.
                                </p>

                            </div>

                            {/* Marketplace Starts Here */}                        {/* Marketplace */}

                        <div>

                            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-neutral-900">
                                Marketplace
                            </h4>

                            <div className="space-y-4">

                                <Link
                                    to="/auctions"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Live Auctions
                                </Link>

                                <Link
                                    to="/auctions"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Categories
                                </Link>

                                <Link
                                    to="/create-auction"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Sell an Item
                                </Link>

                                <Link
                                    to="/dashboard"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Dashboard
                                </Link>

                            </div>

                        </div>

                        {/* Company */}

                        <div>

                            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-neutral-900">
                                Company
                            </h4>

                            <div className="space-y-4">

                                <Link
                                    to="/about"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    About Us
                                </Link>

                                <a
                                    href="#"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Careers
                                </a>

                                <a
                                    href="#"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Blog
                                </a>

                                <a
                                    href="#"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Contact
                                </a>

                            </div>

                        </div>

                        {/* Resources */}

                        <div>

                            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-neutral-900">
                                Resources
                            </h4>

                            <div className="space-y-4">

                                <a
                                    href="#"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Help Center
                                </a>

                                <a
                                    href="#"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    FAQs
                                </a>

                                <a
                                    href="#"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Community
                                </a>

                                <a
                                    href="#"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Documentation
                                </a>

                            </div>

                        </div>

                        {/* Legal */}

                        <div>

                            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-neutral-900">
                                Legal
                            </h4>

                            <div className="space-y-4">

                                <a
                                    href="#"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Privacy Policy
                                </a>

                                <a
                                    href="#"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Terms of Service
                                </a>

                                <a
                                    href="#"
                                    className="block transition hover:text-[#FF5A1F]"
                                >
                                    Cookie Policy
                                </a>

                            </div>

                        </div>

                    </div>

                    {/* Bottom Bar Starts Here */}                    <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-neutral-300 pt-8 md:flex-row">

                        <div>
                            <h4 className="text-lg font-bold text-neutral-900">
                                Bidding Wars
                            </h4>

                            <p className="mt-1 text-sm text-neutral-500">
                                Built for real-time competitive auctions.
                            </p>
                        </div>

                        <p className="text-sm text-neutral-500">
                            © 2026 Bidding Wars. All rights reserved.
                        </p>
<div className="flex flex-wrap items-center gap-6 text-sm font-medium">

    <a
        href="https://github.com/bhavya-dhanwani"
        target="_blank"
        rel="noopener noreferrer"
        className="transition hover:text-[#FF5A1F]"
    >
        Harshit
    </a>

    <a
        href="https://github.com/harshit403-pixel"
        target="_blank"
        rel="noopener noreferrer"
        className="transition hover:text-[#FF5A1F]"
    >
        Bhavya
    </a>

</div>

                    </div>

                </div>

            </section>

        </div>

    </footer>
    );
}

export default Footer;