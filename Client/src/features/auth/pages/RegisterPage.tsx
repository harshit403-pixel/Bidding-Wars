import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import PasswordInput from "../../../shared/components/ui/PasswordInput";

import GoogleButton from "../components/GoogleButton";

import {
    registerSchema,
    type RegisterFormData,
} from "../auth.schema";
import { useRegister } from "../hooks/useRegister";

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
            onSuccess: () => {
                navigate("/");
                // navigate("/login");
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <Card className="space-y-6">
                <div>
                    <h1 className="mb-2 text-3xl font-bold">
                        Create Account
                    </h1>

                    <p className="text-slate-500">
                        Create your account to get started
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <Input
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
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

              

                    <Button
                        type="submit"
                        loading={isPending}
                    >
                        Create Account
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
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-slate-900 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </Card>
        </div>
    );
}

export default RegisterPage;