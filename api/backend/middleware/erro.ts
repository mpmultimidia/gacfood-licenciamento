import type { Request, Response, NextFunction } from "express";
import { ErroValidacao } from "../../licenciamento/validacao.ts";

export function middlewareErro(
  erro: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(erro);

  if (erro instanceof ErroValidacao) {
    res.status(400).json({
      ok: false,
      erro: erro.message,
    });
    return;
  }

  res.status(500).json({
    ok: false,
    erro: "Erro interno do servidor.",
  });
}