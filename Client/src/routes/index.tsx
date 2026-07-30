import { createBrowserRouter } from "react-router";

import RootLayout from "../layouts/RootLayout";

import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import AuctionDetailPage from "../pages/AuctionDetailPage";
import CreateAuctionPage from "../pages/CreateAuctionPage";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import ForgotPasswordPage from "../features/auth/pages/ForgetPasswordPage";

import MarketplacePage from "../features/auction/pages/MarketplacePage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import VerifyEmailRoute from "./VerifyEmailRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            // ==========================
            // Public Routes
            // ==========================
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "auctions",
                element: <MarketplacePage />,
            },
            {
                path: "auction/:roomId",
                element: <AuctionDetailPage />,
            },

            // ==========================
            // Guest Only Routes
            // ==========================
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: "login",
                        element: <LoginPage />,
                    },
                    {
                        path: "register",
                        element: <RegisterPage />,
                    },
                    {
                        path: "forgot-password",
                        element: <ForgotPasswordPage />,
                    },
                ],
            },

            {
                path: "reset-password/:token",
                element: <ResetPasswordPage />,
            },

            {
                element: <VerifyEmailRoute />,
                children: [
                    {
                        path: "verify-email",
                        element: <VerifyEmailPage />,
                    },
                ],
            },

            // ==========================
            // Protected Routes
            // ==========================
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "dashboard",
                        element: <DashboardPage />,
                    },
                    {
                        path: "profile",
                        element: <ProfilePage />,
                    },
                    {
                        path: "create-auction",
                        element: <CreateAuctionPage />,
                    },
                ],
            },
        ],
    },

    {
        path: "*",
        element: <NotFoundPage />,
    },
]);