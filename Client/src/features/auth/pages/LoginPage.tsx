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
                                className="text-sm font-medium text-neutral-500 transition hover:text-black"
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

                    <div className="my-8 flex items-center gap-4">

                        <div className="h-px flex-1 bg-neutral-300" />

                        <span className="text-sm uppercase tracking-[0.2em] text-neutral-400">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-neutral-300" />

                    </div>

                    <GoogleButton />

                    <p className="mt-8 text-center text-sm text-neutral-500">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-semibold text-black transition hover:text-[#FF5A1F]"
                        >
                            Create Account
                        </Link>

                    </p>

                </div>

            </div>

            {/* Right Side Starts Here */}
                        <div className="relative hidden lg:block lg:w-1/2 overflow-hidden">

                {/* Video */}

                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    src={loginVideo}
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Gradient Overlay */}

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/70" />

                {/* Content */}

                <div className="relative flex h-full flex-col justify-between p-16 text-white">

                

                    {/* Main Text */}

                    <div className="max-w-xl">

                        <h2 className="text-7xl font-black uppercase leading-[0.9]">

                            Bid.
                            <br />

                            Win.
                            <br />

                            Repeat.

                        </h2>

                        <p className="mt-8 text-lg leading-8 text-white/80">
                            Discover premium collectibles, compete in real-time
                            auctions and win exclusive items from verified
                            sellers around the globe.
                        </p>

                        {/* Stats */}

                        <div className="mt-14 grid grid-cols-2 gap-5">

                            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">

                                <p className="text-4xl font-black">
                                    25K+
                                </p>

                                <p className="mt-2 text-sm text-white/70">
                                    Active Bidders
                                </p>

                            </div>

                            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">

                                <p className="text-4xl font-black">
                                    12K+
                                </p>

                                <p className="mt-2 text-sm text-white/70">
                                    Live Auctions
                                </p>

                            </div>

                            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">

                                <p className="text-4xl font-black">
                                    ₹50M+
                                </p>

                                <p className="mt-2 text-sm text-white/70">
                                    Total Sales
                                </p>

                            </div>

                            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">

                                <p className="text-4xl font-black">
                                    99%
                                </p>

                                <p className="mt-2 text-sm text-white/70">
                                    Verified Sellers
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default LoginPage;