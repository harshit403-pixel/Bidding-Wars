import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Mail, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import type { RootState } from "../../../app/store";
import { useLogout } from "../hooks/useLogout";
import { verifyOtp, resendOtp } from "../api/auth.api";
import { setUser } from "../auth.slice";

function VerifyEmailPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const { mutate: logout } = useLogout();
    const navigate = useNavigate();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startCountdown = useCallback(() => {
        setCountdown(60);
        setCanResend(false);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => {
        startCountdown();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [startCountdown]);

    const handleResend = async () => {
        if (!user?.email) {
            toast.error("No email found. Please login again.");
            return;
        }

        setResendLoading(true);
        try {
            await resendOtp(user.email);
            toast.success("OTP sent! Check your email.");
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
            startCountdown();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setResendLoading(false);
        }
    };

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = pasted.split("").concat(Array(6 - pasted.length).fill(""));
        setOtp(newOtp);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleSubmit = async () => {
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            toast.error("Please enter the complete 6-digit OTP");
            return;
        }

        if (!user?.email) {
            toast.error("No email found. Please login again.");
            return;
        }

        setLoading(true);
        try {
            await verifyOtp({ email: user.email, otp: otpString });
            dispatch(setUser({ ...user, isVerified: true }));
            toast.success("Email verified successfully!");
            navigate("/");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-[#F5F1EB] px-4">
            <div className="w-full max-w-md space-y-6 border border-neutral-200 bg-white p-6 sm:p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#FF3B00]/10 sm:h-16 sm:w-16">
                    <Mail className="h-7 w-7 text-[#FF3B00] sm:h-8 sm:w-8" />
                </div>

                <h1
                    className="text-3xl uppercase font-black sm:text-4xl"
                    style={{ fontFamily: "Bebas Neue" }}
                >
                    Verify your email
                </h1>

                <p className="text-sm text-neutral-500">
                    We sent a 6-digit code to{" "}
                    <span className="font-medium text-[#111111]">{user?.email}</span>.
                    Enter it below to verify your account.
                </p>

                <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            className="h-12 w-10 border border-neutral-300 bg-white text-center text-xl font-bold outline-none transition focus:border-[#FF3B00] sm:h-14 sm:w-12 sm:text-2xl"
                        />
                    ))}
                </div>

                <p className="text-xs text-neutral-400">
                    Didn&apos;t receive the code? Check your spam folder.
                </p>

                {canResend ? (
                    <button
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="inline-flex items-center gap-2 border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
                    >
                        {resendLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RotateCcw className="h-4 w-4" />
                        )}
                        Resend Code
                    </button>
                ) : (
                    <p className="text-sm text-neutral-500">
                        Resend code in{" "}
                        <span className="font-medium text-[#FF3B00]">
                            {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                            {String(countdown % 60).padStart(2, "0")}
                        </span>
                    </p>
                )}

                <div className="space-y-3 pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || otp.join("").length !== 6}
                        className="flex w-full items-center justify-center gap-2 border-b-2 border-[#FF3B00] bg-[#FF3B00] px-4 py-3 text-white font-medium transition hover:bg-[#FF5A2C] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: "Bebas Neue" }}
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Verify Email"
                        )}
                    </button>
                    <button
                        onClick={() => logout()}
                        className="w-full border border-neutral-300 px-4 py-3 text-neutral-700 font-medium transition hover:bg-neutral-50"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </section>
    );
}

export default VerifyEmailPage;
