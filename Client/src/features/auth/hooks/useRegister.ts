import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import { register } from "../api/auth.api";
import { setCredentials } from "../auth.slice";

export const useRegister = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: register,

        onSuccess: (data) => {
            dispatch(
                setCredentials({
                    user: data.user,
                    accessToken: data.accessToken,
                })
            );

            toast.success("Account created successfully");
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Registration failed"
            );
        },
    });
};