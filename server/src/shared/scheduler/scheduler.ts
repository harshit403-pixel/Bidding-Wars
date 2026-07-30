// Importing modules
import cron from "node-cron";
import { activateUpcomingAuctions, endActiveAuctions } from "./auction.scheduler.js";
import logger from "../config/logger.config.js";

// Start the auction lifecycle scheduler.
// Runs every minute: activates upcoming auctions and ends expired auctions.
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

    logger.info("Auction scheduler started (runs every minute)");
}
