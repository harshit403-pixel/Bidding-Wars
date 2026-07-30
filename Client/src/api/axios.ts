import axios from "axios";

import { store } from "../app/store.ts";
import { logout, setCredentials } from "../features/auth/auth.slice"

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let isRefreshing = false;
let failedQueue: (() => void)[] = [];

const processQueue = () => {
    failedQueue.forEach((callback) => callback());
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    failedQueue.push(() => resolve(api(originalRequest)));
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    "/api/auth/refresh",
                    {},
                    { withCredentials: true },
                );

                store.dispatch(
                    setCredentials({
                        user: data.data.user,
                        accessToken: data.data.accessToken,
                    })
                );

                processQueue();

                return api(originalRequest);
            } catch {
                store.dispatch(logout());

                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;