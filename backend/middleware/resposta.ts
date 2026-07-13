import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Response {
      apiResposta?: (dados: unknown) => Response;
    }
  }
}

export function respostaPadrao(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  res.apiResposta = (dados: unknown): Response => {
    return res.json({
      sucesso: true,
      dados,
    });
  };

  next();
}