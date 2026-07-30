import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Mail } from "lucide-react";

import type { RootState } from "../../../app/store";
import { useLogout } from "../hooks/useLogout";

function VerifyEmailPage() {
    const user = useSelector(
        (state: RootState) => state.auth.user
    );

    const { mutate: logout } = useLogout();
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8F7F5] px-6">

            <div className="w-full max-w-lg text-center">

                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FFE9DF]">

                    <Mail
                        size={42}
                        className="text-[#FF5A1F]"
                    />

                </div>

                <h1 className="mt-10 text-5xl font-black leading-tight">

                    Verify
                    <br />
                    Your Email

                </h1>

                <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-neutral-500">

                    We've sent a verification link to

                    <span className="font-semibold text-black">
                        {" "}
                        {user?.email}
                    </span>

                    . Open your inbox and click the link to activate your account.

                </p>

                <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 text-left">

                    <h3 className="font-semibold">
                        What's next?
                    </h3>

                    <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-500">

                        <li>
                            • Check your inbox for the verification email.
                        </li>

                        <li>
                            • If you don't see it, check your spam or promotions folder.
                        </li>

                        <li>
                            • After verification, return here and log in.
                        </li>

                    </ul>

                </div>

                <div className="mt-10 space-y-4">

                    <button
                        onClick={() => navigate("/")}
                        className="h-14 w-full rounded-full bg-black font-semibold text-white transition hover:bg-[#FF5A1F]"
                    >
                        Go to Home
                    </button>

                    <button
                        onClick={() => logout()}
                        className="h-14 w-full rounded-full border border-neutral-300 bg-white font-semibold transition hover:bg-neutral-100"
                    >
                        Log Out
                    </button>

                </div>

                <p className="mt-10 text-sm text-neutral-400">
                    Need help? Contact support if you still haven't received the email after a few minutes.
                </p>

            </div>

        </div>
    );
}

export default VerifyEmailPage;