import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";

import {
    forgotPasswordSchema,
    type ForgotPasswordFormData,
} from "../auth.schema";

import { useForgotPassword } from "../hooks/useForgetPassword";

export default function ForgotPasswordPage() {
    const { mutate, isPending } = useForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        mutate(data);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8F7F5] px-6">

            <div className="w-full max-w-md">

                <Link
                    to="/"
                    className="text-lg font-bold tracking-tight"
                >
                    Bidding Wars
                </Link>

                <div className="mt-12">

                    <h1 className="text-5xl font-black leading-tight">
                        Forgot
                        <br />
                        Password?
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-neutral-500">
                        No worries. Enter your registered email address and
                        we'll send you a secure password reset link.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-12 space-y-6"
                >

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="h-14 rounded-full bg-black text-base font-semibold transition hover:bg-[#FF5A1F]"
                    >
                        {isPending
                            ? "Sending..."
                            : "Send Reset Link"}
                    </Button>

                </form>

                <div className="my-10 flex items-center gap-4">

                    <div className="h-px flex-1 bg-neutral-300" />

                    <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                        OR
                    </span>

                    <div className="h-px flex-1 bg-neutral-300" />

                </div>

                <p className="text-center text-sm text-neutral-500">

                    Remember your password?{" "}

                    <Link
                        to="/login"
                        className="font-semibold text-black transition hover:text-[#FF5A1F]"
                    >
                        Back to Login
                    </Link>

                </p>

            </div>

        </div>
    );
}