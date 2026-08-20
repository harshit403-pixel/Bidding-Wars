import { io, type Socket } from "socket.io-client";

import { store } from "../app/store";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string;

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false,
            withCredentials: true,
        });
    }
    return socket;
}

export function connectSocket(): void {
    const s = getSocket();
    const token = store.getState().auth.accessToken;

    const currentToken = (s.auth as { token?: string })?.token;

    if (token && currentToken !== token) {
        s.auth = { token };
        if (s.connected || s.active) {
            s.disconnect();
        }
        s.connect();
        return;
    }

    if (!s.connected && !s.active) {
        if (token) {
            s.auth = { token };
        }
        s.connect();
    }
}

export function disconnectSocket(): void {
    if (socket?.connected) {
        socket.disconnect();
    }
}
