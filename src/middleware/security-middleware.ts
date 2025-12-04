import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
// @ts-expect-error: No type definitions for 'xss-clean'
import xss from "xss-clean";
import compression from "compression";
import { Express } from "express";
import { appConfig } from "../config/app-config";

export const setupSecurityMiddleware = (app: Express): void => {
  app.use(helmet());

  app.use(
    cors({
      origin: appConfig.cors.origin,
      credentials: true,
    })
  );

  const limiter = rateLimit({
    windowMs: appConfig.security.rateLimitWindowMs,
    max: appConfig.security.rateLimitMaxRequests,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/", limiter);

  app.use(mongoSanitize());

  app.use(xss());

  app.use(hpp());

  app.use(compression());
};
