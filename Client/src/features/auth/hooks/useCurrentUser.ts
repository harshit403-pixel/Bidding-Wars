import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { getCurrentUser } from "../api/auth.api";
import { finishAuthCheck, setUser } from "../auth.slice";

export const useCurrentUser = () => {
    const dispatch = useDispatch();

    const query = useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (query.isSuccess && query.data) {
            dispatch(setUser(query.data));
        }

        if (query.isError) {
            dispatch(finishAuthCheck());
        }
    }, [
        query.isSuccess,
        query.isError,
        query.data,
        dispatch,
    ]);

    return query;
};