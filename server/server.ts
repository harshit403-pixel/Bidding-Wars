import createApp from "./src/app.js";
import connectDB from "./src/shared/config/db.config.js";
import env from "./src/shared/config/env.config.js";
import logger from "./src/shared/config/logger.config.js";
import { startAuctionStatusJob } from "./src/shared/jobs/auctionStatus.job.js";

async function startServer() {
	const app = createApp();

	await connectDB();

	startAuctionStatusJob();

	app.listen(env.PORT || 5000, () => {
		logger.info(`Server is running on port ${env.PORT || 5000}`);
	});
}

startServer();
