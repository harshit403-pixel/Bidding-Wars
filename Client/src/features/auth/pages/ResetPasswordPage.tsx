import { Link, useParams } from "react-router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/Button";
import PasswordInput from "../../../shared/components/ui/PasswordInput";

import {
    resetPasswordSchema,
    type ResetPasswordFormData,
} from "../auth.schema";

import { useResetPassword } from "../hooks/useResetPassword";

export default function ResetPasswordPage() {
    const { token } = useParams<{ token: string }>();

    const { mutate, isPending } = useResetPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = (data: ResetPasswordFormData) => {
        if (!token) return;

        mutate({
            token,
            password: data.password,
            confirmPassword: data.confirmPassword,
        });
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
                        Reset
                        <br />
                        Password
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Create a new password for your account.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-12 space-y-6"
                >

                    <PasswordInput
                        label="New Password"
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        Reset Password
                    </Button>

                </form>

                <p className="text-center text-sm">
                    Back to{" "}

                    <Link
                        to="/login"
                        className="font-medium underline"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}