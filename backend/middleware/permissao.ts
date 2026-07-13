import type { NextFunction, Request, Response } from "express";
import { verificarPermissao } from "../../servicos/permissaoAcesso.js";

export function exigirPermissao(modulo: string) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const usuarioId =
      req.usuario?.id ||
      (req.headers["usuario-id"] as string);

    if (!usuarioId) {
      res.status(401).json({
        ok: false,
        erro: "Usuário não autenticado.",
      });
      return;
    }

    const permissao = await verificarPermissao(
      usuarioId,
      modulo
    );

    if (!permissao.permitido) {
      res.status(403).json({
        ok: false,
        erro: "Acesso negado.",
      });
      return;
    }

    next();
  };
}