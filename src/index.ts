import { config } from "./config/config";
import { app } from "./app";
import http from "http";
import { createDataBaseConnection, logger } from "./helper";

let server: Record<any, any> = new http.Server(app);

const startServer = async () => {
  try {
    // Database Connection
    logger.info("startServer:: Server is ready");
    await createDataBaseConnection();
  } catch (error) {
    logger.error("startServer:: Database Connection Error", error);
    process.exit(1);
  }
  /* Start the Server */
  const apiServer = server.listen(config.port, (err: Object) => {
    if (err) {
      return logger.error("ERR:: launching server ", err);
    }
    logger.success(
      `startServer:: Server is live at ${config.protocol}://${config.host}:${config.port}`
    );
  });

  // Setting server timeouts/values from config are received as strings so convert them in number before use
  apiServer.timeout = parseInt(config.server_timeout);
  apiServer.keepAliveTimeout = parseInt(config.keep_alive_timeout);
  apiServer.headersTimeout = parseInt(config.header_timeout);
};

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception thrown", err);
});

process.on("unhandledRejection", (reason: any, p) => {
  logger.error("Unhandled rejection at: Promise", p, "reason:", reason);
});

let lastMemoryUsage = { rss: 0 };

const factor = 1048576;
// Start API Server
startServer();

const printMemInfo = () => {
  try {
    const memoryUsage = process.memoryUsage();

    memoryUsage.rss /= factor;

    const memDiff = Math.abs(lastMemoryUsage.rss - memoryUsage.rss);

    if (memDiff > 10) {
      memoryUsage.heapTotal /= factor;

      memoryUsage.heapUsed /= factor;

      lastMemoryUsage = memoryUsage;

      logger.important(
        `printMemInfo:: Memory usage RSS: ${memoryUsage.rss}, heapTotal: ${memoryUsage.heapTotal}, heapUsed: ${memoryUsage.heapUsed}`
      );
    }
  } catch (err) {
    logger.error(
      "printMemInfo:: Unable to fetch memory usage information:",
      err
    );
  }
};
setInterval(printMemInfo, 10 * 1000);

setInterval(() => {
  try {
    logger.info("Server is live and running", process.uptime());
  } catch (err) {
    logger.error("Error while checking Server process liveness", err);
  }
}, 40000);

const stop = () => {
  server.close();
};

export { stop, server };
