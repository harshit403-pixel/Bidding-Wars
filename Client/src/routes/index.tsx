import { createBrowserRouter, Navigate } from "react-router";

import RootLayout from "../layouts/RootLayout";

import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import AuctionDetailPage from "../pages/AuctionDetailPage";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import ForgotPasswordPage from "../features/auth/pages/ForgetPasswordPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import VerifyEmailRoute from "./VerifyEmailRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                    },
                    {
                        path: "dashboard",
                        element: <Navigate to="/" replace />,
                    },
                    {
                        path: "auction/:roomId",
                        element: <AuctionDetailPage />,
                    },
                ],
            },

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
        ],
    },

    {
        path: "*",
        element: <NotFoundPage />,
    },
]);
