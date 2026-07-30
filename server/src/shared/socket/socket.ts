import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import logger from "../config/logger.config.js";
import env from "../config/env.config.js";
import { authenticateSocket } from "./socket.auth.js";
import { registerSocketEvents } from "./socket.events.js";

let io: Server;

export function initSocket(httpServer: HTTPServer): Server {
    io = new Server(httpServer, {
        cors: {
            origin: env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    io.use(authenticateSocket);

    registerSocketEvents(io);

    logger.info("Socket.io server initialized");
    return io;
}

export function getIO(): Server | null {
    return io || null;
}
