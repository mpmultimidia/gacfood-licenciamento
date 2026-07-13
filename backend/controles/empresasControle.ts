import type { Request, Response } from "express";
import { supabase } from "../../supabase/conexao.js";
import { buscarEmpresaPorCodigo } from "../../licenciamento/validacao.js";

export async function consultarEmpresa(
  req: Request,
  res: Response
): Promise<void> {
  const { codigo } = req.body as {
    codigo?: string;
  };

  if (!codigo) {
    res.status(400).json({
      ok: false,
      erro: "Informe o código da empresa.",
    });
    return;
  }

  const empresa = await buscarEmpresaPorCodigo(
    codigo
  );

  res.json({
    ok: true,
    empresa: {
      codigo: empresa.codigo,
      nome_fantasia: empresa.nome_fantasia,
      status: empresa.status,
    },
  });
}

export async function listarEmpresas(
  req: Request,
  res: Response
): Promise<void> {
  const busca = (
    req.query.busca as string | undefined
  )?.trim();

  let consulta = supabase
    .from("vw_empresas_licencas")
    .select("*")
    .order("nome_fantasia");

  if (busca) {
    consulta = consulta.or(
      `codigo.ilike.%${busca}%,nome_fantasia.ilike.%${busca}%`
    );
  }

  const {
    data,
    error,
  } = await consulta;

  if (error) {
    throw error;
  }

  res.json({
    ok: true,
    empresas: data ?? [],
  });
}