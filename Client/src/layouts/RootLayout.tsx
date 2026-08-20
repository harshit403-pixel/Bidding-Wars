import { Outlet, useLocation } from "react-router";
import Navbar from "../shared/components/Navbar";
import Footer from "../shared/components/Footer";

const RootLayout = () => {
    const { pathname } = useLocation();

    const hideLayout = [
        "/login",
        "/register",
        "/forgot-password",
        "/verify-email",
    ].includes(pathname);

    return (
        <>
            {!hideLayout && <Navbar />}

            <main>
                <Outlet />
            </main>

            {pathname === "/" && <Footer />}
        </>
    );
};

export default RootLayout;