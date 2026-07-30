import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import PasswordInput from "../../../shared/components/ui/PasswordInput";

import GoogleButton from "../components/GoogleButton";

import { loginSchema, type LoginFormData } from "../auth.schema";
import { useLogin } from "../hooks/useLogin";

function LoginPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const { mutate: login, isPending } = useLogin();

    const onSubmit = (data: LoginFormData) => {
        login(data, {
            onSuccess: (response) => {
                if (response.user.isVerified) {
                    navigate("/");
                } else {
                    navigate("/verify-email");
                }
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F5F1EB] px-4">
            <Card className="space-y-6">
                <div className="text-center">
                    <h1
                        className="mb-2 text-3xl uppercase font-black sm:text-4xl"
                        style={{ fontFamily: "Bebas Neue" }}
                    >
                        Welcome Back
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Login to your account
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
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-neutral-500 hover:text-[#FF3B00]"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        loading={isPending}
                    >
                        Login
                    </Button>
                </form>

                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-neutral-200" />
                    <span className="text-xs uppercase tracking-wide text-neutral-400">
                        OR
                    </span>
                    <div className="h-px flex-1 bg-neutral-200" />
                </div>

                <GoogleButton />

                <p className="text-center text-sm text-neutral-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-[#FF3B00] hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </Card>
        </div>
    );
}

export default LoginPage;