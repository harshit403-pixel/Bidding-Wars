import { Link } from "react-router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Card from "../../../shared/components/ui/Card";
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
        <div className="flex min-h-screen items-center justify-center bg-[#F5F1EB] px-4">
            <Card className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1
                        className="text-3xl uppercase font-black sm:text-4xl"
                        style={{ fontFamily: "Bebas Neue" }}
                    >
                        Forgot Password
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Enter your email and we&apos;ll send you a password reset link.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <Button
                        type="submit"
                        loading={isPending}
                    >
                        Send Reset Link
                    </Button>
                </form>

                <p className="text-center text-sm text-neutral-500">
                    Remember your password?{" "}
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