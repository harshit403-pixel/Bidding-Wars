import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import PasswordInput from "../../../shared/components/ui/PasswordInput";

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
            onSuccess: () => {
                navigate("/");
                // navigate("/dashboard");
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <Card>
                <h1 className="mb-2 text-3xl font-bold">
                    Welcome Back
                </h1>

                <p className="mb-8 text-slate-500">
                    Login to your account
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div>
                        <Input
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            {...register("email")}
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <PasswordInput
                            placeholder="Password"
                            autoComplete="current-password"
                            {...register("password")}
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        loading={isPending}
                    >
                        Login
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm">
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