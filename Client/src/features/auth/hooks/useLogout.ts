import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { logout as logoutApi } from "../api/auth.api";
import { logout } from "../auth.slice";

export const useLogout = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: logoutApi,

        onSuccess: () => {
            dispatch(logout());
        },
    });
};