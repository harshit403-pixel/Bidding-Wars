import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import PasswordInput from "../../../shared/components/ui/PasswordInput";

import GoogleButton from "../components/GoogleButton";

import {
    registerSchema,
    type RegisterFormData,
} from "../auth.schema";

import { useRegister } from "../hooks/useRegister";

import registerVideo from "../../../assets/registerVideo.webm";

function RegisterPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const { mutate: registerUser, isPending } =
        useRegister();

    const onSubmit = (data: RegisterFormData) => {
        registerUser(data, {
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

            <div className="relative hidden overflow-hidden lg:block lg:w-1/2">

                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    src={registerVideo}
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/70" />

                <div className="relative flex h-full flex-col justify-between p-16 text-white">


                    <div className="max-w-xl">

                        <h2 className="text-7xl font-black uppercase leading-[0.9]">

                            Sell.
                            <br />

                            Bid.
                            <br />

                            Discover.

                        </h2>

                        <p className="mt-8 text-lg leading-8 text-white/80">
                            Create your account and join thousands of collectors
                            buying, selling and competing in real-time auctions.
                        </p>

                        {/* Stats Starts Here */}


                                                <div className="mt-14 grid grid-cols-2 gap-5">

                            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">

                                <p className="text-4xl font-black">
                                    30K+
                                </p>

                                <p className="mt-2 text-sm text-white/70">
                                    Registered Users
                                </p>

                            </div>

                            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">

                                <p className="text-4xl font-black">
                                    15K+
                                </p>

                                <p className="mt-2 text-sm text-white/70">
                                    Products Listed
                                </p>

                            </div>

                            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">

                                <p className="text-4xl font-black">
                                    ₹75M+
                                </p>

                                <p className="mt-2 text-sm text-white/70">
                                    Transactions
                                </p>

                            </div>

                            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">

                                <p className="text-4xl font-black">
                                    100%
                                </p>

                                <p className="mt-2 text-sm text-white/70">
                                    Secure Platform
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Right Side */}

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
                            Create
                            <br />
                            Account.
                        </h1>

                        <p className="mt-5 text-lg leading-8 text-neutral-500">
                            Join Bidding Wars and start exploring exclusive
                            live auctions from verified sellers.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >                        <Input
                            label="Username"
                            type="text"
                            placeholder="Enter your username"
                            autoComplete="username"
                            error={errors.name?.message}
                            {...register("name")}
                        />

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
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <Button
                            type="submit"
                            loading={isPending}
                            className="h-14 rounded-full bg-black text-base font-semibold transition hover:bg-[#FF5A1F]"
                        >
                            Create Account
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

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-semibold text-black transition hover:text-[#FF5A1F]"
                        >
                            Sign In
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default RegisterPage;