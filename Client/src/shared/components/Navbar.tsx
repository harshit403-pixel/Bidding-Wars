import { Link } from "react-router";
import { Menu, Search } from "lucide-react";

function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[#F5F1EB]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3"
                >
                    <div className="text-4xl font-black text-[#FF3B00]">
                        ++
                    </div>

           
                </Link>

                {/* Desktop */}
                <nav className="hidden items-center gap-14 text-lg md:flex">
                    <Link
                        to="/"
                        className="transition hover:text-[#FF3B00]"
                    >
                        Home
                    </Link>

                    <Link
                        to="/auctions"
                        className="transition hover:text-[#FF3B00]"
                    >
                        Auctions
                    </Link>

                    <Link
                        to="/categories"
                        className="transition hover:text-[#FF3B00]"
                    >
                        Categories
                    </Link>

                    <Link
                        to="/dashboard"
                        className="transition hover:text-[#FF3B00]"
                    >
                        Dashboard
                    </Link>
                </nav>

                {/* Right */}
                <div className="hidden items-center gap-8 md:flex">
                    <button className="transition hover:text-[#FF3B00]">
                        <Search size={22} />
                    </button>

                    <Link
                        to="/login"
                        className="border-b border-transparent pb-1 transition hover:border-[#FF3B00] hover:text-[#FF3B00]"
                    >
                        Login
                    </Link>
                </div>

                <button className="md:hidden">
                    <Menu size={28} />
                </button>
            </div>
        </header>
    );
}

export default Navbar;