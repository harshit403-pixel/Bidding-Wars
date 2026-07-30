import { createServer } from "http";
import createApp from "./src/app.js";
import connectDB from "./src/shared/config/db.config.js";
import env from "./src/shared/config/env.config.js";
import logger from "./src/shared/config/logger.config.js";
import { startScheduler } from "./src/shared/scheduler/scheduler.js";
import { initSocket } from "./src/shared/socket/socket.js";

async function startServer() {
    const app = createApp();
    const httpServer = createServer(app);

    await connectDB();

    initSocket(httpServer);
    startScheduler();

    httpServer.listen(env.PORT || 5000, () => {
        logger.info(`Server is running on port ${env.PORT || 5000}`);
    });
}

startServer();
