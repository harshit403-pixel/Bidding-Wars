import { createBrowserRouter } from "react-router";

import RootLayout from "../layouts/RootLayout";

import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

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
                ],
            },
        ],
    },

    {
        path: "*",
        element: <NotFoundPage />,
    },
]);