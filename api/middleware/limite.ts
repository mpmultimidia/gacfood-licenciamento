import type { Request, Response, NextFunction } from "express";

const requisicoes = new Map<string, number>();

export function limiteRequisicoes(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const chave =
    req.ip || "global";

  const total =
    requisicoes.get(chave) ?? 0;

  if (total >= 100) {
    res.status(429).json({
      ok: false,
      erro: "Muitas requisições.",
    });
    return;
  }

  requisicoes.set(
    chave,
    total + 1
  );

  setTimeout(() => {
    requisicoes.set(
      chave,
      Math.max(
        (requisicoes.get(chave) ?? 1) - 1,
        0
      )
    );
  }, 60000);

  next();
}