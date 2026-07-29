import { Outlet } from "react-router";

function RootLayout() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Outlet />
        </main>
    );
}

export default RootLayout;