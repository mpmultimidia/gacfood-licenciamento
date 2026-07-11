import { Request, Response, NextFunction } from "express";

export function corsMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  res.header(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, usuario-id"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  next();
}