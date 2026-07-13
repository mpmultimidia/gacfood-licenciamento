import type { Request, Response, NextFunction } from "express";
import { ambiente } from "../../config/ambiente.js";

export function corsMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const origem =
    ambiente.ambienteExecucao === "development"
      ? "*"
      : ambiente.painelUrl;

  res.header(
    "Access-Control-Allow-Origin",
    origem
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  next();
}