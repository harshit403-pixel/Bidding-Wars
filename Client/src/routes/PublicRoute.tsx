import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

import type { RootState } from "../app/store";

function PublicRoute() {
    const { isAuthenticated, isAuthChecked } = useSelector(
        (state: RootState) => state.auth
    );

    if (!isAuthChecked) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    return isAuthenticated ? (
        <Navigate to="/" replace />
    ) : (
        <Outlet />
    );
}

export default PublicRoute;