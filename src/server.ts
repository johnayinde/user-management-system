import app from "./app";
import dotenv from "dotenv";
import { testDbConnection, syncDb } from "./config/database";
import logger from "./config/logger";

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  try {
    await testDbConnection();

    await syncDb(true);

    app.listen(PORT, () => {
      logger.info(
        `Node Server running on ${NODE_ENV} mode on port ==>> ${PORT}`
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully");
  process.exit(0);
});

startServer();
