import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ambiente } from "../../config/ambiente.js";

export interface UsuarioAutenticado {
  id: string;
  email: string;
  perfil: string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

export function autenticarCliente(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const chave = req.header("x-api-key");

  if (!chave || chave !== ambiente.apiKeyCliente) {
    res.status(401).json({
      ok: false,
      erro: "Cliente não autorizado.",
    });
    return;
  }

  next();
}

export function autenticarAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const autorizacao = req.header("authorization");

  if (!autorizacao) {
    res.status(401).json({
      ok: false,
      erro: "Token não informado.",
    });
    return;
  }

  const token = autorizacao.startsWith("Bearer ")
    ? autorizacao.substring(7)
    : autorizacao;

  try {
    const usuario = jwt.verify(
      token,
      ambiente.apiKeyAdmin
    ) as UsuarioAutenticado;

    req.usuario = usuario;

    next();
  } catch {
    res.status(401).json({
      ok: false,
      erro: "Token inválido.",
    });
  }
}