import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import type { RootState } from "../app/store";
import { getSocket, connectSocket, disconnectSocket } from "./socket";
import { SocketContext } from "./SocketContext";

interface SocketProviderProps {
    children: ReactNode;
}

function SocketProvider({ children }: SocketProviderProps) {
    const socket = useMemo(() => getSocket(), []);
    const [connected, setConnected] = useState(socket.connected);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const isAuthChecked = useSelector((state: RootState) => state.auth.isAuthChecked);
    const listenersRef = useRef(false);

    useEffect(() => {
        if (listenersRef.current) return;
        listenersRef.current = true;

        function onConnect() {
            setConnected(true);
        }

        function onDisconnect() {
            setConnected(false);
        }

        function onConnectError(err: Error) {
            if (err.message === "Authentication required" || err.message === "Invalid or expired token") {
                toast.error("Socket authentication failed. Please log in again.");
            }
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);
            listenersRef.current = false;
        };
    }, [socket]);

    useEffect(() => {
        if (isAuthChecked) {
            connectSocket();
        }
    }, [isAuthenticated, isAuthChecked]);

    const connect = useCallback(() => {
        connectSocket();
    }, []);

    const disconnect = useCallback(() => {
        disconnectSocket();
    }, []);

    const value = useMemo(() => ({
        socket,
        connected,
        connect,
        disconnect,
    }), [socket, connected, connect, disconnect]);

    return (
        <SocketContext value={value}>
            {children}
        </SocketContext>
    );
}

export default SocketProvider;
