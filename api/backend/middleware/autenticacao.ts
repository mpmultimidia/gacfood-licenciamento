import type { Request, Response, NextFunction } from "express";

export function autenticacao(
  _req: Request,
  _res: Response,
  next: NextFunction
): void {
  next();
}