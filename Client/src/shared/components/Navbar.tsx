import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, Search, X, Plus } from "lucide-react";
import { useSelector } from "react-redux";

import { useLogout } from "../../features/auth/hooks/useLogout";
import type { RootState } from "../../app/store";

function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const { isAuthenticated, user } = useSelector(
        (state: RootState) => state.auth
    );

    const { mutate: logout } = useLogout();

    const navClass = ({ isActive }: { isActive: boolean }) =>
        `transition ${
            isActive
                ? "text-[#FF3B00]"
                : "hover:text-[#FF3B00]"
        }`;

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[#F5F1EB]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 md:h-24 md:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2"
                >
                    <span className="text-3xl font-black text-[#FF3B00] sm:text-4xl">
                        ++
                    </span>

                    <span className="hidden text-lg font-semibold md:block">
                        Bidding Wars
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-10 text-lg md:flex">
                   

                    <NavLink
                        to="/auctions"
                        className={navClass}
                    >
                        Marketplace
                    </NavLink>

                    {isAuthenticated && (
                        <>
                            <NavLink
                                to="/dashboard"
                                className={navClass}
                            >
                                Dashboard
                            </NavLink>

                           
                        </>
                    )}
                </nav>

                {/* Desktop Right */}
                <div className="hidden items-center gap-5 md:flex">
                    <button className="transition hover:text-[#FF3B00]">
                        <Search size={20} />
                    </button>

                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/create-auction"
                                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-white transition hover:bg-[#FF3B00]"
                            >
                                <Plus size={16} />
                                Create auction
                            </Link>

                            <Link
                                to="/profile"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-white"
                            >
                                {user?.name?.charAt(0).toUpperCase()}
                            </Link>

                            <button
                                onClick={() => logout()}
                                className="transition hover:text-[#FF3B00]"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="transition hover:text-[#FF3B00]"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-full bg-white px-5 py-2 text-sm text-black transition hover:bg-[#FF3B00]"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="border-t border-neutral-200 bg-[#F5F1EB] px-5 py-6 md:hidden">
                    <nav className="flex flex-col gap-5 text-lg">
                        <NavLink
                            to="/"
                            end
                            onClick={() => setMobileOpen(false)}
                            className={navClass}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/auctions"
                            onClick={() => setMobileOpen(false)}
                            className={navClass}
                        >
                            Marketplace
                        </NavLink>

                        {isAuthenticated && (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                    className={navClass}
                                >
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    to="/create-auction"
                                    onClick={() => setMobileOpen(false)}
                                    className={navClass}
                                >
                                    Create Auction
                                </NavLink>

                                <NavLink
                                    to="/profile"
                                    onClick={() => setMobileOpen(false)}
                                    className={navClass}
                                >
                                    Profile
                                </NavLink>
                            </>
                        )}
                    </nav>

                    <div className="mt-6 border-t border-neutral-200 pt-5">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-white">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>

                                    <span>{user?.name}</span>
                                </div>

                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileOpen(false);
                                    }}
                                    className="text-left  transition hover:text-[#FF3B00]"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-full bg-white px-5 py-3 text-center text-white"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;