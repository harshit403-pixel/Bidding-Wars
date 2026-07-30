import api from "../../../api/axios";

import type {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
    User,
      ForgotPasswordResponse,
      ResetPasswordResponse,
      ForgotPasswordPayload,
      ResetPasswordPayload,
      VerifyOtpPayload

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

export const getCurrentUser = async (): Promise<User> => {
    const { store } = await import("../../../app/store");
    const token = store.getState().auth.accessToken;

    // If we already have an access token, use GET /auth/me directly
    if (token) {
        const { data } = await api.get<
            ApiResponse<{ user: User }>
        >("/auth/me");
        return data.data.user;
    }

    // No token in memory (page was refreshed). Try to obtain one via
    // the refresh-token cookie so we don't trigger a pointless 401.
    const { data } = await api.post<
        ApiResponse<{ user: User; accessToken: string }>
    >("/auth/refresh");

    const { setCredentials } = await import("../auth.slice");
    store.dispatch(
        setCredentials({
            user: data.data.user,
            accessToken: data.data.accessToken,
        }),
    );

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
export const forgotPassword = async (
    payload: ForgotPasswordPayload,
) => {
    const { data } = await api.post<
        ApiResponse<ForgotPasswordResponse>
    >("/auth/forgot-password", payload);

    return data;
};

export const resetPassword = async (
    payload: ResetPasswordPayload,
) => {
    const { data } = await api.post<
        ApiResponse<ResetPasswordResponse>
    >("/auth/reset-password", payload);

    return data;
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
    const { data } = await api.post<ApiResponse<null>>(
        "/auth/verify-otp",
        payload
    );

    return data;
};

export const resendOtp = async (email: string) => {
    const { data } = await api.post<ApiResponse<null>>(
        "/auth/resend-otp",
        { email }
    );

    return data;
};