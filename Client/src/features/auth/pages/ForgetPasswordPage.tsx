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

                    <p className="text-sm text-muted-foreground">
                        Enter your email and we'll send you a password reset link.
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
                        className="w-full"
                        disabled={isPending}
                    >
                        Send Reset Link
                    </Button>

                </form>

                <p className="text-center text-sm">
                    Remember your password?{" "}

                    <Link
                        to="/login"
                        className="font-medium underline"
                    >
                        Back to Login
                    </Link>

                </p>

            </div>

        </div>
    );
}