import { Request, Response, NextFunction } from "express";
import { verificarPermissao } from "../../servicos/permissaoAcesso.js";

export function exigirPermissao(
  modulo: string
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const usuarioId =
      req.headers["usuario-id"] as string;

    if (!usuarioId) {
      return res.status(401).json({
        mensagem: "Usuário não informado"
      });
    }

    const permissao =
      await verificarPermissao(
        usuarioId,
        modulo
      );

    if (!permissao.permitido) {
      return res.status(403).json({
        mensagem: "Acesso negado"
      });
    }

    next();
  };
}