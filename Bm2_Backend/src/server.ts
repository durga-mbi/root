// Force restart - Merge Auth
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import * as swaggerUi from "swagger-ui-express";
import config from "./config";
import v1 from "./api/v1";
import errorHandler from "./middleware/error-handler";
import morganMiddleware from "./middleware/morgan-middleware";
import swaggerSpec from "./config/swagger";

export const createServer = () => {
  const app = express();

  // In development → no rate limit so testing is unrestricted
  // In production  → 100 requests per minute per IP
  const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 100,
    skip: () => config.env === "development" || config.env === "dev",
    standardHeaders: true,
    legacyHeaders: false,
  });

  app
    .use(helmet())
    .use(limiter)
    .disable("x-powered-by")
    .use(morganMiddleware)
    .use(cookieParser())
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(
      cors({
        origin: (origin, callback) => {
          // Allow all origins but echo back the origin for credentials support
          callback(null, true);
        },
        credentials: true,
      }),
    );

  /**
   * @openapi
   * /health:
   *   get:
   *     tags:
   *       - Health
   *     description: Health check endpoint
   *     responses:
   *       200:
   *         description: Returns status ok
   */
  app.get("/health", (req: Request, res: Response) => {
    res.json({ ok: true, environment: config.env });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/v1", v1);

  app.use(errorHandler);

  return app;
};
