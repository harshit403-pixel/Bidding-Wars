import { useState } from "react";
import { Link } from "react-router";
import { Menu, Search, X } from "lucide-react";
import { useSelector } from "react-redux";

import { useLogout } from "../../features/auth/hooks/useLogout";
import type { RootState } from "../../app/store";

function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { mutate: logout } = useLogout();

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[#F5F1EB]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 md:h-24 md:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3"
                >
                    <div className="text-3xl font-black text-[#FF3B00] sm:text-4xl">
                        ++
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-10 text-lg md:flex lg:gap-14">
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

                    {isAuthenticated && (
                        <Link
                            to="/dashboard"
                            className="transition hover:text-[#FF3B00]"
                        >
                            Dashboard
                        </Link>
                    )}
                </nav>

                {/* Desktop Right */}
                <div className="hidden items-center gap-6 md:flex lg:gap-8">
                    <button className="transition hover:text-[#FF3B00]">
                        <Search size={20} />
                    </button>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-5">
                            <span className="text-xs uppercase tracking-[0.25em] text-neutral-500 lg:text-sm">
                                {user?.name}
                            </span>
                            <button
                                onClick={() => logout()}
                                className="border-b border-transparent pb-1 transition hover:border-[#FF3B00] hover:text-[#FF3B00]"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="border-b border-transparent pb-1 transition hover:border-[#FF3B00] hover:text-[#FF3B00]"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="border-t border-neutral-200 bg-[#F5F1EB] px-4 pb-6 pt-4 md:hidden">
                    <nav className="flex flex-col gap-4 text-lg">
                        <Link
                            to="/"
                            onClick={() => setMobileOpen(false)}
                            className="transition hover:text-[#FF3B00]"
                        >
                            Home
                        </Link>

                        <Link
                            to="/auctions"
                            onClick={() => setMobileOpen(false)}
                            className="transition hover:text-[#FF3B00]"
                        >
                            Auctions
                        </Link>

                        {isAuthenticated && (
                            <Link
                                to="/dashboard"
                                onClick={() => setMobileOpen(false)}
                                className="transition hover:text-[#FF3B00]"
                            >
                                Dashboard
                            </Link>
                        )}
                    </nav>

                    <div className="mt-6 border-t border-neutral-200 pt-4">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-4">
                                <span className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                                    {user?.name}
                                </span>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileOpen(false);
                                    }}
                                    className="text-left transition hover:text-[#FF3B00]"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                                className="transition hover:text-[#FF3B00]"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
