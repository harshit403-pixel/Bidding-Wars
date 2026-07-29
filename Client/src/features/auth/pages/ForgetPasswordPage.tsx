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
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md space-y-6 p-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">
                        Forgot Password
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Enter your email and we'll send you a password reset link.
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
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending
                            ? "Sending..."
                            : "Send Reset Link"}
                    </Button>
                </form>

                <p className="text-center text-sm">
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        className="font-medium underline"
                    >
                        Login
                    </Link>
                </p>
            </Card>
        </div>
    );
}