import { FcGoogle } from "react-icons/fc";

import { useGoogleLogin } from "../hooks/useGoogleLogin";

export default function GoogleButton() {
    const { loginWithGoogle } = useGoogleLogin();

    return (
        <button
            type="button"
            onClick={loginWithGoogle}
            className="flex w-full items-center justify-center gap-3 border border-neutral-300 bg-white px-4 py-3 font-medium text-[#111111] transition hover:bg-neutral-50"
        >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
        </button>
    );
}