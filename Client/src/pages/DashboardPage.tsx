import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Gavel, Trophy, Package, Clock } from "lucide-react";

import { useDashboard } from "../features/dashboard/hooks/useDashboard";
import type { RootState } from "../app/store";

function DashboardPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { data: stats, isLoading } = useDashboard();

    return (
        <div className="min-h-screen bg-[#F5F1EB] text-[#111111]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:py-20">
                <div className="mb-8 sm:mb-12 md:mb-16">
                    <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#FF3B00] sm:mb-3 sm:text-sm sm:tracking-[0.35em]">
                        Welcome back
                    </p>
                    <h1
                        className="text-4xl uppercase sm:text-5xl md:text-6xl"
                        style={{ fontFamily: "Bebas Neue" }}
                    >
                        {user?.name ?? "Dashboard"}
                    </h1>
                </div>

                {isLoading ? (
                    <div className="py-20 text-center text-neutral-500 sm:py-32">Loading stats...</div>
                ) : stats ? (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
                            <div className="border border-neutral-200 bg-white p-5 sm:p-6 md:p-8">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#FF3B00]/10 sm:mb-4 sm:h-12 sm:w-12">
                                    <Gavel className="h-4 w-4 text-[#FF3B00] sm:h-5 sm:w-5" />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">
                                    Active Auctions
                                </p>
                                <p
                                    className="mt-1 text-3xl font-bold sm:mt-2 sm:text-4xl"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    {stats.activeAuctions}
                                </p>
                            </div>

                            <div className="border border-neutral-200 bg-white p-5 sm:p-6 md:p-8">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#FF3B00]/10 sm:mb-4 sm:h-12 sm:w-12">
                                    <Package className="h-4 w-4 text-[#FF3B00] sm:h-5 sm:w-5" />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">
                                    My Auctions
                                </p>
                                <p
                                    className="mt-1 text-3xl font-bold sm:mt-2 sm:text-4xl"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    {stats.myAuctions}
                                </p>
                            </div>

                            <div className="border border-neutral-200 bg-white p-5 sm:p-6 md:p-8">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#FF3B00]/10 sm:mb-4 sm:h-12 sm:w-12">
                                    <Trophy className="h-4 w-4 text-[#FF3B00] sm:h-5 sm:w-5" />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">
                                    Won Auctions
                                </p>
                                <p
                                    className="mt-1 text-3xl font-bold sm:mt-2 sm:text-4xl"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    {stats.wonAuctions}
                                </p>
                            </div>

                            <div className="border border-neutral-200 bg-white p-5 sm:p-6 md:p-8">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#FF3B00]/10 sm:mb-4 sm:h-12 sm:w-12">
                                    <Clock className="h-4 w-4 text-[#FF3B00] sm:h-5 sm:w-5" />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.25em]">
                                    Total Bids
                                </p>
                                <p
                                    className="mt-1 text-3xl font-bold sm:mt-2 sm:text-4xl"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    {stats.totalBids}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 border-t border-neutral-200 pt-8 sm:mt-16 sm:pt-12">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#FF3B00] sm:mb-3 sm:text-sm sm:tracking-[0.35em]">
                                        Quick Action
                                    </p>
                                    <h2
                                        className="text-3xl uppercase sm:text-4xl"
                                        style={{ fontFamily: "Bebas Neue" }}
                                    >
                                        Browse Auctions
                                    </h2>
                                </div>
                                <Link
                                    to="/auctions"
                                    className="border-b-2 border-[#FF3B00] pb-1.5 text-base font-medium text-[#FF3B00] transition sm:pb-2 sm:text-lg"
                                >
                                    View All
                                </Link>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default DashboardPage;
