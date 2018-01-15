import * as express from "express";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as lusca from "lusca";
import * as morgan from "morgan";
import * as path from "path";
import { NextFunction } from "express-serve-static-core";

/**
 * Debug loggin
 */
require("debug")("app:app");

/**
 * Express App
 */
const app: express.Application = express();

/**
 * Global Middleware
 */
app.use(compression());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

/**
 * Serving static production files
 */
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "./client")));

  app.get("*", (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, "./client/dist/index.html"));
  });
}

/**
 * 404 Handler
 */
app.use((req: express.Request, res: express.Response, next: NextFunction) => {
  const err = new Error("404 Page not found.");
  err.message = "404";
  next(err);
});

/**
 * Error Handler
 */
app.use((err: Error, req: express.Request, res: express.Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(Number(err.message) || 500).json(err);
});

export default app;
