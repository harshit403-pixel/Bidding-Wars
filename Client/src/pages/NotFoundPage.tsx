import { Link } from "react-router";

function NotFoundPage() {
    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-6xl font-bold">404</h1>

            <p className="text-gray-500">
                Page not found
            </p>

            <Link
                to="/"
                className="rounded-lg bg-black px-5 py-2 text-white"
            >
                Go Home
            </Link>
        </section>
    );
}

export default NotFoundPage;