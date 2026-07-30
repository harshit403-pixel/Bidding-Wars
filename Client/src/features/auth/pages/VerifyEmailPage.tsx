import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Mail } from "lucide-react";

import type { RootState } from "../../../app/store";
import { useLogout } from "../hooks/useLogout";

function VerifyEmailPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { mutate: logout } = useLogout();
    const navigate = useNavigate();

    return (
        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Mail className="h-8 w-8 text-blue-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                    Verify your email
                </h1>

                <p className="text-gray-500">
                    We sent a verification link to{" "}
                    <span className="font-medium text-slate-900">{user?.email}</span>.
                    Please check your inbox and click the link to verify your account.
                </p>

                <p className="text-sm text-gray-400">
                    Didn&apos;t receive the email? Check your spam folder or contact support.
                </p>

                <div className="space-y-3 pt-2">
                    <button
                        onClick={() => navigate("/")}
                        className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white font-medium transition hover:bg-slate-800"
                    >
                        Go to Home
                    </button>
                    <button
                        onClick={() => logout()}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 font-medium transition hover:bg-slate-50"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </section>
    );
}

export default VerifyEmailPage;
