import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import PasswordInput from "../../../shared/components/ui/PasswordInput";

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

    const { mutate: registerUser, isPending } = useRegister();

    const onSubmit = (data: RegisterFormData) => {
        registerUser(data, {
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
                    Create Account
                </h1>

                <p className="mb-8 text-slate-500">
                    Register to start bidding
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div>
                        <Input
                            type="text"
                            placeholder="Full Name"
                            autoComplete="name"
                            {...register("name")}
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

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
                            autoComplete="new-password"
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
                        Create Account
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm">
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