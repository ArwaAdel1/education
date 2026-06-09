import type { Request, Response, NextFunction } from "express";

export function authenticateMiddleware(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  next();
}
