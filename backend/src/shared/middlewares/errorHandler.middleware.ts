import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  const status =
    "status" in err && typeof err.status === "number" ? err.status : 500;
  const message =
    err instanceof Error ? err.message : "Internal server error";

  if (status >= 500) {
    logger.error(message, err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" &&
    status >= 500 &&
    err instanceof Error &&
    err.stack
      ? { stack: err.stack }
      : {}),
  });
};
