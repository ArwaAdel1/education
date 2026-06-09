import type { Request, Response, NextFunction } from "express";

export function authorizeMiddleware(roles: string[]) {
  return (_req: Request, _res: Response, next: NextFunction) => {
    void roles;
    next();
  };
}
