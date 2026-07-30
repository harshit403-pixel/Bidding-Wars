import createApp from "./src/app.js";
import connectDB from "./src/shared/config/db.config.js";
import env from "./src/shared/config/env.config.js";
import logger from "./src/shared/config/logger.config.js";
import { startScheduler } from "./src/shared/scheduler/scheduler.js";

async function startServer() {
	const app = createApp();

	await connectDB();

	startScheduler();

	app.listen(env.PORT || 5000, () => {
		logger.info(`Server is running on port ${env.PORT || 5000}`);
	});
}

startServer();
