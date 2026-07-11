import { Request, Response, NextFunction } from "express";

export function middlewareErro(
  erro: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(erro);

  res.status(500).json({
    erro: true,
    mensagem: erro.message || "Erro interno do servidor"
  });
}