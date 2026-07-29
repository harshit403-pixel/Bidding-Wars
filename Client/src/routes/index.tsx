import { createBrowserRouter } from "react-router";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import HomePage from "../pages/HomePage";
import ForgotPasswordPage from "../features/auth/pages/ForgetPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import NotFoundPage from "../pages/NotFoundPage";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },

    {
        path: "/login",
        element: <LoginPage />,
    },

    {
        path: "/register",
        element: <RegisterPage />,
    },

    {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
    },

    {
        path: "/reset-password",
        element: <ResetPasswordPage />,
    },

    {
        path: "*",
        element: <NotFoundPage />,
    },
]);