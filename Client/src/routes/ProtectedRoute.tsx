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

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
