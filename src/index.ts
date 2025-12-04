import express, { Express } from "express";
import cookieParser from "cookie-parser";
import "express-async-errors";
import { connectDatabase } from "./config/database-config";
import { appConfig } from "./config/app-config";
import { setupSecurityMiddleware } from "./middleware/security-middleware";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import routes from "./routes";
import { logger } from "./utils/logger";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

setupSecurityMiddleware(app);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const server = app.listen(appConfig.port, () => {
      logger.info(`Server running in ${appConfig.env} mode on port ${appConfig.port}`);
    });

    process.on("unhandledRejection", (err: Error) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        logger.info("Process terminated");
      });
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();
