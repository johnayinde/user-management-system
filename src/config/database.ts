import { Sequelize } from "sequelize";
import path from "path";
import logger from "./logger";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../database.sqlite"),
  logging: (msg) => logger.debug(msg),
});

export const testDbConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw error;
  }
};

// Function to sync models with the database
export const syncDb = async (force = false): Promise<void> => {
  try {
    if (process.env.NODE_ENV === "production") {
      logger.info(
        "Database sync skipped in production. Use migrations instead."
      );
      return;
    }

    await sequelize.sync({ force });
    logger.info("Database synced" + (force ? " (tables recreated)" : ""));
  } catch (error) {
    logger.error("Error syncing database:", error);
    throw error;
  }
};

export default sequelize;
