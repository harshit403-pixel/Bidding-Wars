import api from "../../../api/axios";

import type {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
    User,
} from "../auth.types";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const login = async (payload: LoginPayload) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        payload
    );

    return data.data;
};

export const register = async (payload: RegisterPayload) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
        "/auth/signup",
        payload
    );

    return data.data;
};

export const logout = async () => {
    const { data } = await api.post<ApiResponse<null>>(
        "/auth/logout"
    );

    return data;
};

export const getCurrentUser = async () => {
    const { data } = await api.get<
        ApiResponse<{
            user: User;
        }>
    >("/auth/me");

    return data.data.user;
};

export const refreshToken = async () => {
    const { data } = await api.post<
        ApiResponse<{
            accessToken: string;
        }>
    >("/auth/refresh");

    return data.data.accessToken;
};