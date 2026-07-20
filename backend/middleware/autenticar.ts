import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ambiente } from "../../config/ambiente.js";

export interface UsuarioAutenticado {
  id: string;
  login: string;
  perfil: string;
  tipo: "administrador" | "usuario";
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

  console.log(
    `[auth-diagnostico] recebida: "${chave}" (tamanho ${chave?.length ?? 0}, últimos 4: ${chave?.slice(-4)}) | ` +
    `esperada: (tamanho ${ambiente.apiKeyCliente?.length ?? 0}, últimos 4: ${ambiente.apiKeyCliente?.slice(-4)}) | ` +
    `bate: ${chave === ambiente.apiKeyCliente}`
  );

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

// Usa DEPOIS de autenticarAdmin — bloqueia usuários secundários (tabela
// lic.usuarios") de rotas restritas ao MASTER/administrador (ex.: o
// Dashboard, que mostra receita e dados financeiros do negócio).
export function exigirAdministrador(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.usuario?.tipo !== "administrador") {
    res.status(403).json({
      ok: false,
      erro: "Acesso restrito ao administrador.",
    });
    return;
  }

  next();
}