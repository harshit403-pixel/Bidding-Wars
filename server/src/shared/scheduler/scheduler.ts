import cron from "node-cron";
import { activateUpcomingAuctions, endActiveAuctions } from "./auction.scheduler.js";
import logger from "../config/logger.config.js";
import socketManager from "../socket/socket.manager.js";
import { getIO } from "../socket/socket.js";

let timerInterval: ReturnType<typeof setInterval> | null = null;

function tickTimer() {
    const io = getIO();
    if (!io) return;

    const now = Date.now();
    const rooms = socketManager.getAllRooms();

    for (const [roomId, room] of rooms) {
        const remainingMs = room.endTime - now;
        const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));

        io.to(roomId).emit("timer_update", {
            auctionId: room.auctionId,
            remainingSeconds,
            status: remainingSeconds > 0 ? "active" : "ended",
        });

        if (remainingSeconds <= 0) {
            socketManager.deleteRoom(roomId);
        }
    }
}

export function startTimerTick() {
    if (timerInterval) return;

    timerInterval = setInterval(tickTimer, 1000);

    logger.info("Timer tick started (1s interval)");
}

export function stopTimerTick() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        logger.info("Timer tick stopped");
    }
}

export function startScheduler() {
    cron.schedule("* * * * *", async () => {
        logger.debug("Scheduler tick: checking auctions");

        try {
            await activateUpcomingAuctions();
        } catch (error) {
            logger.error({ error }, "Scheduler: activateUpcomingAuctions failed");
        }

        try {
            await endActiveAuctions();
        } catch (error) {
            logger.error({ error }, "Scheduler: endActiveAuctions failed");
        }
    });

    startTimerTick();

    logger.info("Auction scheduler started (runs every minute)");
}
