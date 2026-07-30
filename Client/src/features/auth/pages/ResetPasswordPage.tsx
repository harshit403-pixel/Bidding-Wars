import { Link, useParams } from "react-router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
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
        <div className="flex min-h-screen items-center justify-center bg-[#F5F1EB] px-4">
            <Card className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1
                        className="text-3xl uppercase font-black sm:text-4xl"
                        style={{ fontFamily: "Bebas Neue" }}
                    >
                        Reset Password
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Create a new password for your account.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <PasswordInput
                        label="New Password"
                        placeholder="Enter your new password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />

                    <Button
                        type="submit"
                        loading={isPending}
                    >
                        Reset Password
                    </Button>
                </form>

                <p className="text-center text-sm text-neutral-500">
                    Back to{" "}
                    <Link
                        to="/login"
                        className="font-medium text-[#FF3B00] hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </Card>
        </div>
    );
}