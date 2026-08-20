import jwt from "jsonwebtoken";
import env from "../config/env.config.js";
import logger from "../config/logger.config.js";
import { AuthenticatedSocket } from "./socket.types.js";

export function authenticateSocket(socket: AuthenticatedSocket, next: (err?: Error) => void) {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
        logger.debug({ socketId: socket.id }, "Socket auth: guest connection");
        socket.userId = "guest_" + socket.id;
        socket.username = "Guest";
        (socket as any).isGuest = true;
        return next();
    }

    try {
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as { _id: string; userId: string; name: string; email: string };
        socket.userId = decoded._id || decoded.userId;
        socket.username = decoded.name || decoded.email;
        (socket as any).isGuest = false;
        next();
    } catch {
        logger.debug({ socketId: socket.id }, "Socket auth: invalid token, setting as guest");
        socket.userId = "guest_" + socket.id;
        socket.username = "Guest";
        (socket as any).isGuest = true;
        next();
    }
}
