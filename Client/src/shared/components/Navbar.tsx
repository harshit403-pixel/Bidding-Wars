import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, Plus, X } from "lucide-react";
import { useSelector } from "react-redux";

import { useLogout } from "../../features/auth/hooks/useLogout";
import type { RootState } from "../../app/store";

function Navbar() {
    const [showNavbar, setShowNavbar] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { isAuthenticated, user } = useSelector(
        (state: RootState) => state.auth
    );

    const { mutate: logout } = useLogout();

   useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        setScrolled(currentScrollY > 30);

        if (currentScrollY < 80) {
            setShowNavbar(true);
        } else if (currentScrollY > lastScrollY) {
            // Scrolling down
            setShowNavbar(false);
        } else {
            // Scrolling up
            setShowNavbar(true);
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
        window.removeEventListener("scroll", handleScroll);
}, []);

    const navClass = ({ isActive }: { isActive: boolean }) =>
        `relative transition duration-300 ${
            scrolled
                ? isActive
                    ? "text-black"
                    : "text-neutral-600 hover:text-black"
                : isActive
                  ? "text-white"
                  : "text-white/70 hover:text-white"
        }`;

    return (
      <header
    className={`fixed left-0 top-0 z-50 w-full px-4 py-5 transition-transform duration-500 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
    }`}
>
            <div
                className={`mx-auto flex h-20 max-w-7xl items-center justify-between rounded-full px-8 transition-all duration-500 ${
                    scrolled
                        ? "border border-neutral-200 bg-white shadow-xl"
                        : "border border-white/15 bg-white/10 backdrop-blur-xl"
                }`}
            >

                {/* Logo */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF3B00] text-lg font-black text-white shadow-sm">
                        BW
                    </div>

                    <span
                        className={`hidden text-xl font-semibold lg:block ${
                            scrolled
                                ? "text-black"
                                : "text-white"
                        }`}
                    >
                        Bidding Wars
                    </span>
                </Link>

                {/* Desktop Navigation */}

                <nav className="hidden items-center gap-10 lg:flex">

                    <NavLink
                        to="/auctions"
                        className={navClass}
                    >
                        Marketplace
                    </NavLink>

                    {isAuthenticated && (
                        <NavLink
                            to="/dashboard"
                            className={navClass}
                        >
                            Dashboard
                        </NavLink>
                    )}

                </nav>

                {/* Right Side */}

                <div className="hidden items-center gap-5 lg:flex">

                    {isAuthenticated ? (
                        <>

                            <Link
                                to="/create-auction"
                                className="flex items-center gap-2 rounded-full bg-[#FF3B00] px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:scale-105 hover:bg-[#FF5A2C] shadow-md"
                            >
                                <Plus size={16} />
                                Create Auction
                            </Link>

                            <Link
                                to="/profile"
                                className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF3B00] via-neutral-900 to-black text-sm font-black text-white shadow-md ring-2 ring-white/20 transition duration-300 hover:scale-105 hover:ring-[#FF3B00] hover:shadow-lg"
                                title={user?.name || "View Profile"}
                            >
                                <span>{user?.name?.charAt(0).toUpperCase()}</span>
                                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" title="Online" />
                            </Link>

                            <button
                                onClick={() => logout()}
                                className={`transition ${
                                    scrolled
                                        ? "text-neutral-600 hover:text-black"
                                        : "text-white/70 hover:text-white"
                                }`}
                            >
                                Logout
                            </button>

                        </>
                    ) : (
                        <div className="flex items-center gap-4">

                            <Link
                                to="/login"
                                className={`transition ${
                                    scrolled
                                        ? "text-neutral-700 hover:text-black"
                                        : "text-white/70 hover:text-white"
                                }`}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-full bg-white px-6 py-3 font-medium text-black transition duration-300 hover:scale-105 hover:bg-neutral-100"
                            >
                                Get Started
                            </Link>

                        </div>
                    )}

                </div>

                {/* Mobile Menu Button */}

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className={`lg:hidden ${
                        scrolled
                            ? "text-black"
                            : "text-white"
                    }`}
                >
                    {mobileOpen ? (
                        <X size={28} />
                    ) : (
                        <Menu size={28} />
                    )}
                </button>

            </div>

            {/* Mobile Menu Starts Here */}
                        {mobileOpen && (
                <div
                    className={`mt-4 overflow-hidden rounded-3xl transition-all duration-300 lg:hidden ${
                        scrolled
                            ? "border border-neutral-200 bg-white shadow-xl"
                            : "border border-white/15 bg-black/70 backdrop-blur-2xl"
                    }`}
                >
                    <nav className="flex flex-col p-6">

                        <NavLink
                            to="/auctions"
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `rounded-xl px-4 py-3 transition ${
                                    scrolled
                                        ? isActive
                                            ? "bg-neutral-100 font-medium text-black"
                                            : "text-neutral-700 hover:bg-neutral-100"
                                        : isActive
                                          ? "bg-white/10 text-white"
                                          : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >
                            Marketplace
                        </NavLink>

                        {isAuthenticated && (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `rounded-xl px-4 py-3 transition ${
                                            scrolled
                                                ? isActive
                                                    ? "bg-neutral-100 font-medium text-black"
                                                    : "text-neutral-700 hover:bg-neutral-100"
                                                : isActive
                                                  ? "bg-white/10 text-white"
                                                  : "text-white/70 hover:bg-white/10 hover:text-white"
                                        }`
                                    }
                                >
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    to="/create-auction"
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `rounded-xl px-4 py-3 transition ${
                                            scrolled
                                                ? isActive
                                                    ? "bg-neutral-100 font-medium text-black"
                                                    : "text-neutral-700 hover:bg-neutral-100"
                                                : isActive
                                                  ? "bg-white/10 text-white"
                                                  : "text-white/70 hover:bg-white/10 hover:text-white"
                                        }`
                                    }
                                >
                                    Create Auction
                                </NavLink>
                            </>
                        )}
                                                <div
                            className={`mt-6 border-t pt-6 ${
                                scrolled
                                    ? "border-neutral-200"
                                    : "border-white/10"
                            }`}
                        >
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileOpen(false)}
                                        className="mb-5 flex items-center gap-4"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black font-semibold text-white">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <p
                                                className={`font-medium ${
                                                    scrolled
                                                        ? "text-black"
                                                        : "text-white"
                                                }`}
                                            >
                                                {user?.name}
                                            </p>

                                            <p
                                                className={`text-sm ${
                                                    scrolled
                                                        ? "text-neutral-500"
                                                        : "text-white/60"
                                                }`}
                                            >
                                                View Profile
                                            </p>
                                        </div>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileOpen(false);
                                        }}
                                        className="w-full rounded-full bg-black py-3 font-medium text-white transition hover:bg-[#FF5A1F]"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className={`text-center transition ${
                                            scrolled
                                                ? "text-neutral-700 hover:text-black"
                                                : "text-white hover:text-white"
                                        }`}
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-full bg-black py-3 text-center font-medium text-white transition hover:bg-[#FF5A1F]"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>

                    </nav>
                </div>
            )}
        </header>
    );
}

export default Navbar;