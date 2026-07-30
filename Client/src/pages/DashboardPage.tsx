import ActiveAuctions from "../shared/components/dashboard/ActiveAuctions";
import ActivityTimeline from "../shared/components/dashboard/ActivityTimeline";
import DashboardHeader from "../shared/components/dashboard/DashboardHeader";
import DashboardStats from "../shared/components/dashboard/DashboardStats";
import RecentBids from "../shared/components/dashboard/RecentBids";
import Watchlist from "../shared/components/dashboard/Watchlist";


function DashboardPage() {
    return (
        <main className="min-h-screen bg-[#F5F1EB]">

            <DashboardHeader />

            <section className="mx-auto max-w-7xl px-8 py-16">

                <DashboardStats />

                <div className="mt-16 grid gap-10 lg:grid-cols-[2fr_1fr]">

                    <ActiveAuctions />

                    <ActivityTimeline />

                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-2">

                    <RecentBids />

                    <Watchlist />

                </div>

            </section>

        </main>
    );
}

export default DashboardPage;