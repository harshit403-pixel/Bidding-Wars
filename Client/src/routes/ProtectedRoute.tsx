import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

import type { RootState } from "../app/store";

function ProtectedRoute() {
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
        <Outlet />
    ) : (
        <Navigate to="/login" replace />
    );
}

export default ProtectedRoute;