import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import { login } from "../api/auth.api";
import { setCredentials } from "../auth.slice";

export const useLogin = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: login,

        onSuccess: (data) => {
            dispatch(
                setCredentials({
                    user: data.user,
                    accessToken: data.accessToken,
                })
            );

            toast.success("Logged in successfully");
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? "Login failed"
            );
        },
    });
};