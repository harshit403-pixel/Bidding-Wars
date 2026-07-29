export interface User {
    _id: string;
    userId: string;
    name: string;
    email: string;
    isVerified: boolean;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}