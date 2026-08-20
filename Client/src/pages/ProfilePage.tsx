import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Gavel, Trophy, Package, CheckCircle2, CreditCard, ExternalLink, Edit3, X, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RootState } from "../app/store";
import { useAuctions, useUpdateAuction, useDeleteAuction } from "../features/auction/hooks/useAuctions";
import { useDashboard } from "../features/dashboard/hooks/useDashboard";
import { processRazorpayPayment } from "../shared/utils/razorpay";
import { useQueryClient } from "@tanstack/react-query";
import type { Auction } from "../features/auction/auction.types";

function ProfilePage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<"won" | "my">("won");
    const { data: stats } = useDashboard();
    const updateAuctionMutation = useUpdateAuction();
    const deleteAuctionMutation = useDeleteAuction();

    const handleDeleteAuction = (auction: Auction) => {
        if (window.confirm(`Are you sure you want to delete the auction "${auction.title}"?`)) {
            deleteAuctionMutation.mutate(auction._id, {
                onSuccess: () => {
                    toast.success("Auction deleted successfully!");
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message || "Failed to delete auction");
                },
            });
        }
    };

    const [editingAuction, setEditingAuction] = useState<Auction | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editCondition, setEditCondition] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStartingPrice, setEditStartingPrice] = useState("");
    const [editIncrement, setEditIncrement] = useState("");

    const { data: wonData, isLoading: wonLoading } = useAuctions({
        winner: user?._id,
        limit: 20,
    });

    const { data: myData, isLoading: myLoading } = useAuctions({
        seller: user?._id,
        limit: 20,
    });

    const wonAuctions = wonData?.auctions ?? [];
    const myAuctions = myData?.auctions ?? [];

    const handleOpenEdit = (auction: Auction) => {
        setEditingAuction(auction);
        setEditTitle(auction.title);
        setEditCategory(auction.category || "Electronics");
        setEditCondition(auction.condition || "New");
        setEditDescription(auction.description || "");
        setEditStartingPrice(String(auction.startingPrice || auction.currentPrice));
        setEditIncrement(String(auction.minimumIncrement || 1));
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAuction) return;

        updateAuctionMutation.mutate(
            {
                auctionId: editingAuction._id,
                data: {
                    title: editTitle,
                    category: editCategory,
                    condition: editCondition,
                    description: editDescription,
                    startingBid: Number(editStartingPrice),
                    minimumIncrement: Number(editIncrement),
                },
            },
            {
                onSuccess: () => {
                    toast.success("Auction updated successfully!");
                    setEditingAuction(null);
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message || "Failed to update auction");
                },
            }
        );
    };

    if (!user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#F5F1EB] text-[#111111]">
                <div className="text-center">
                    <p className="mb-4 text-neutral-500">Please sign in to view your profile.</p>
                    <Link
                        to="/login"
                        className="bg-[#FF3B00] px-6 py-2.5 font-semibold text-white transition hover:bg-[#FF5A2C]"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F1EB] text-[#111111]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-8">
                {/* Header Profile Card */}
                <div className="mb-8 border border-neutral-200 bg-white p-6 sm:p-8 md:p-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-5">
                            <div className="flex h-16 w-16 items-center justify-center bg-black text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1
                                        className="text-3xl uppercase font-black sm:text-4xl"
                                        style={{ fontFamily: "Bebas Neue" }}
                                    >
                                        {user.name}
                                    </h1>
                                    {user.isVerified && (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                    )}
                                </div>
                                <p className="text-sm text-neutral-500">{user.email}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="rounded bg-neutral-100 px-2.5 py-0.5 text-xs uppercase tracking-wider text-neutral-600">
                                        {(user as any).role ?? "User"}
                                    </span>
                                    {user.isVerified ? (
                                        <span className="rounded bg-emerald-50 px-2.5 py-0.5 text-xs uppercase tracking-wider text-emerald-700">
                                            Verified Account
                                        </span>
                                    ) : (
                                        <span className="rounded bg-amber-50 px-2.5 py-0.5 text-xs uppercase tracking-wider text-amber-700">
                                            Unverified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/create-auction"
                            className="inline-flex items-center justify-center gap-2 border-b-2 border-[#FF3B00] bg-[#FF3B00] px-6 py-3 font-semibold uppercase tracking-wider text-white transition hover:bg-[#FF5A2C]"
                        >
                            + Create Auction
                        </Link>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-neutral-200 pt-6 sm:grid-cols-4 sm:gap-6">
                        <button
                            onClick={() => setActiveTab("won")}
                            className="bg-neutral-50 p-4 text-center transition hover:bg-neutral-100 border border-transparent hover:border-[#FF3B00]"
                        >
                            <Trophy className="mx-auto mb-1 h-5 w-5 text-[#FF3B00]" />
                            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
                                Won Auctions
                            </p>
                            <p
                                className="mt-1 text-2xl font-bold sm:text-3xl"
                                style={{ fontFamily: "Bebas Neue" }}
                            >
                                {wonAuctions.length}
                            </p>
                        </button>
                        <button
                            onClick={() => setActiveTab("my")}
                            className="bg-neutral-50 p-4 text-center transition hover:bg-neutral-100 border border-transparent hover:border-[#FF3B00]"
                        >
                            <Package className="mx-auto mb-1 h-5 w-5 text-[#FF3B00]" />
                            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
                                My Listings
                            </p>
                            <p
                                className="mt-1 text-2xl font-bold sm:text-3xl"
                                style={{ fontFamily: "Bebas Neue" }}
                            >
                                {myAuctions.length}
                            </p>
                        </button>
                        <Link
                            to="/auctions?status=active"
                            className="bg-neutral-50 p-4 text-center transition hover:bg-neutral-100 border border-transparent hover:border-[#FF3B00]"
                        >
                            <Gavel className="mx-auto mb-1 h-5 w-5 text-[#FF3B00]" />
                            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
                                Active Auctions
                            </p>
                            <p
                                className="mt-1 text-2xl font-bold sm:text-3xl"
                                style={{ fontFamily: "Bebas Neue" }}
                            >
                                {stats?.activeAuctions ?? 0}
                            </p>
                        </Link>
                        <div className="bg-neutral-50 p-4 text-center">
                            <Gavel className="mx-auto mb-1 h-5 w-5 text-[#FF3B00]" />
                            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
                                Total Bids Placed
                            </p>
                            <p
                                className="mt-1 text-2xl font-bold sm:text-3xl"
                                style={{ fontFamily: "Bebas Neue" }}
                            >
                                {stats?.totalBids ?? 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex border-b border-neutral-300">
                    <button
                        onClick={() => setActiveTab("won")}
                        className={`px-6 py-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition ${
                            activeTab === "won"
                                ? "border-[#FF3B00] text-[#FF3B00]"
                                : "border-transparent text-neutral-500 hover:text-black"
                        }`}
                    >
                        🏆 Won Auctions ({wonAuctions.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("my")}
                        className={`px-6 py-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition ${
                            activeTab === "my"
                                ? "border-[#FF3B00] text-[#FF3B00]"
                                : "border-transparent text-neutral-500 hover:text-black"
                        }`}
                    >
                        📦 My Listings ({myAuctions.length})
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "won" && (
                    <div className="space-y-4">
                        {wonLoading ? (
                            <div className="py-16 text-center text-neutral-500">Loading won auctions...</div>
                        ) : wonAuctions.length === 0 ? (
                            <div className="border border-neutral-200 bg-white p-12 text-center text-neutral-500">
                                <p className="mb-2 text-lg font-semibold">No auctions won yet</p>
                                <p className="text-sm">Explore live marketplace auctions and place your bids!</p>
                                <Link
                                    to="/auctions"
                                    className="mt-4 inline-block bg-black px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#FF3B00]"
                                >
                                    Browse Marketplace
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {wonAuctions.map((auction) => (
                                    <div
                                        key={auction._id}
                                        className="flex flex-col justify-between border border-neutral-200 bg-white p-5 sm:p-6"
                                    >
                                        <div className="flex gap-4">
                                            <div className="h-20 w-24 flex-shrink-0 overflow-hidden bg-neutral-100">
                                                {auction.images[0] ? (
                                                    <img
                                                        src={auction.images[0]}
                                                        alt={auction.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <Gavel className="h-8 w-8 text-neutral-300" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="truncate text-lg font-bold">{auction.title}</h3>
                                                    <Link
                                                        to={`/auction/${auction.roomId}`}
                                                        className="text-neutral-400 hover:text-[#FF3B00]"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                                <p className="mt-0.5 text-xs uppercase tracking-wider text-neutral-500">
                                                    Winning Price
                                                </p>
                                                <p className="text-xl font-black text-[#FF3B00]">
                                                    ₹{auction.currentPrice.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                                            <span className="text-xs uppercase tracking-wider text-neutral-500">
                                                Payment Status:{" "}
                                                <strong
                                                    className={
                                                        auction.paymentStatus === "paid"
                                                            ? "text-emerald-600"
                                                            : "text-amber-600"
                                                    }
                                                >
                                                    {auction.paymentStatus ?? "Pending"}
                                                </strong>
                                            </span>

                                            {auction.paymentStatus === "paid" ? (
                                                <span className="inline-flex items-center gap-1 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Paid
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        processRazorpayPayment({
                                                            auctionId: auction._id,
                                                            auctionTitle: auction.title,
                                                            amount: auction.currentPrice,
                                                            user,
                                                            onSuccess: () => {
                                                                queryClient.invalidateQueries({ queryKey: ["auctions"] });
                                                            },
                                                        });
                                                    }}
                                                    className="inline-flex items-center gap-1.5 bg-[#FF3B00] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#FF5A2C]"
                                                >
                                                    <CreditCard className="h-3.5 w-3.5" /> Pay with Razorpay
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "my" && (
                    <div className="space-y-4">
                        {myLoading ? (
                            <div className="py-16 text-center text-neutral-500">Loading your listings...</div>
                        ) : myAuctions.length === 0 ? (
                            <div className="border border-neutral-200 bg-white p-12 text-center text-neutral-500">
                                <p className="mb-2 text-lg font-semibold">No listings created yet</p>
                                <Link
                                    to="/create-auction"
                                    className="mt-4 inline-block bg-[#FF3B00] px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#FF5A2C]"
                                >
                                    Create Your First Auction
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {myAuctions.map((auction) => (
                                    <div
                                        key={auction._id}
                                        className="flex items-center justify-between border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="h-16 w-20 flex-shrink-0 overflow-hidden bg-neutral-100">
                                                {auction.images[0] ? (
                                                    <img
                                                        src={auction.images[0]}
                                                        alt={auction.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <Gavel className="h-6 w-6 text-neutral-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-neutral-900 truncate">{auction.title}</h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded ${
                                                        auction.status === "active"
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : auction.status === "upcoming"
                                                            ? "bg-amber-100 text-amber-800"
                                                            : "bg-neutral-100 text-neutral-600"
                                                    }`}>
                                                        {auction.status}
                                                    </span>
                                                </div>
                                                <p className="mt-1 font-bold text-[#FF3B00]">
                                                    ₹{auction.currentPrice.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            {auction.status !== "ended" && (
                                                <button
                                                    onClick={() => handleDeleteAuction(auction)}
                                                    className="inline-flex items-center gap-1 border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600 transition hover:bg-red-600 hover:text-white"
                                                    title="Delete Auction"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Delete
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleOpenEdit(auction)}
                                                className="inline-flex items-center gap-1 bg-[#111111] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#FF3B00]"
                                                title="Edit Auction"
                                            >
                                                <Edit3 className="h-3.5 w-3.5" />
                                                Edit
                                            </button>
                                            <Link
                                                to={`/auction/${auction.roomId}`}
                                                className="p-2 text-neutral-500 hover:text-[#FF3B00] transition"
                                                title="View Auction Room"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Auction Modal Overlay */}
            {editingAuction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl overflow-hidden border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto">
                        <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4">
                            <div>
                                <h2
                                    className="text-3xl uppercase font-black"
                                    style={{ fontFamily: "Bebas Neue" }}
                                >
                                    Edit Auction
                                </h2>
                                <p className="text-xs text-neutral-500">
                                    Update listing details for "{editingAuction.title}"
                                </p>
                            </div>
                            <button
                                onClick={() => setEditingAuction(null)}
                                className="text-neutral-400 hover:text-black transition"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                                    Auction Title
                                </label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    required
                                    className="w-full border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-[#FF3B00] focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                        className="w-full border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-[#FF3B00] focus:bg-white"
                                    >
                                        <option value="Electronics">Electronics</option>
                                        <option value="Art">Art</option>
                                        <option value="Collectibles">Collectibles</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Automobiles">Automobiles</option>
                                        <option value="Real Estate">Real Estate</option>
                                        <option value="Watches">Watches</option>
                                        <option value="Jewelry">Jewelry</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                                        Condition
                                    </label>
                                    <select
                                        value={editCondition}
                                        onChange={(e) => setEditCondition(e.target.value)}
                                        className="w-full border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-[#FF3B00] focus:bg-white"
                                    >
                                        <option value="New">New</option>
                                        <option value="Like New">Like New</option>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                                        Starting Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={editStartingPrice}
                                        onChange={(e) => setEditStartingPrice(e.target.value)}
                                        min={1}
                                        required
                                        className="w-full border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-[#FF3B00] focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                                        Min Increment (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={editIncrement}
                                        onChange={(e) => setEditIncrement(e.target.value)}
                                        min={1}
                                        required
                                        className="w-full border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-[#FF3B00] focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={4}
                                    className="w-full border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-[#FF3B00] focus:bg-white"
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingAuction(null)}
                                    className="border border-neutral-300 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateAuctionMutation.isPending}
                                    className="inline-flex items-center gap-2 bg-[#FF3B00] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#FF5A2C] disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {updateAuctionMutation.isPending ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
