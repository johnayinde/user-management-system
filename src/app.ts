import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes";
import addressRoutes from "./routes/addressRoutes";
import postRoutes from "./routes/postRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";
import logger from "./config/logger";
import morganMiddleware from "./middleware/morganMiddleware";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morganMiddleware);

logger.info("Server initialized");

// Routes
app.use("/users", userRoutes);
app.use("/addresses", addressRoutes);
app.use("/posts", postRoutes);

// Error handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
