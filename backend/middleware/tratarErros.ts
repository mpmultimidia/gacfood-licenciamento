import type { NextFunction, Request, Response } from "express";
import { ErroValidacao } from "../../licenciamento/validacao.ts";

export function tratarErros(
  erro: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (erro instanceof ErroValidacao) {
    res.status(400).json({
      ok: false,
      erro: erro.message,
    });
    return;
  }

  console.error("Erro interno:", erro);

  res.status(500).json({
    ok: false,
    erro: "Erro interno do servidor.",
  });
}

export function envolverAsync(
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    fn(req, res, next).catch(next);
  };
}