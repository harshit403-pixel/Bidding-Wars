import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import PasswordInput from "../../../shared/components/ui/PasswordInput";

import GoogleButton from "../components/GoogleButton";

import { loginSchema, type LoginFormData } from "../auth.schema";
import { useLogin } from "../hooks/useLogin";

import loginVideo from "../../../assets/loginVideo.webm";

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
        <div className="flex min-h-screen bg-[#F8F7F5]">

            {/* Left Side */}

            <div className="flex w-full items-center justify-center px-8 py-12 lg:w-1/2">

                <div className="w-full max-w-md">

                    <div className="mb-12">

                        <Link
                            to="/"
                            className="text-lg font-bold tracking-tight"
                        >
                            Bidding Wars
                        </Link>

                        <h1 className="mt-10 text-5xl font-black leading-tight">
                            Welcome
                            <br />
                            Back.
                        </h1>

                        <p className="mt-5 text-lg leading-8 text-neutral-500">
                            Sign in to continue bidding on premium auctions and
                            manage your marketplace activity.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
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
                            className="text-sm text-slate-600 hover:text-slate-900"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                        <Button
                            type="submit"
                            loading={isPending}
                            className="h-14 rounded-full bg-black text-base font-semibold transition hover:bg-[#FF5A1F]"
                        >
                            Login
                        </Button>

                    </form>

                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200" />

                    <span className="text-sm text-slate-500">
                        OR
                    </span>

                    <div className="h-px flex-1 bg-slate-200" />
                </div>

                    <GoogleButton />

                <p className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-slate-900 hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </Card>
        </div>
    );
}

export default LoginPage;