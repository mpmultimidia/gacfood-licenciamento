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

  // CORREÇÃO: antes consultava a view "vw_empresas_licencas", que não
  // devolve "id" nem "nome_fantasia" no formato que a tela espera —
  // por isso a lista aparecia vazia/quebrada. Agora consulta a tabela
  // "empresas" diretamente, com todos os campos que o cadastro usa.
  let consulta = supabase
    .from("empresas")
    .select(
      "id, codigo, razao_social, nome_fantasia, cnpj, telefone, whatsapp, email, cidade, uf, status, observacoes, plano_id, limite_dispositivos, criado_em"
    )
    .order("nome_fantasia");

  if (busca) {
    consulta = consulta.or(
      `codigo.ilike.%${busca}%,nome_fantasia.ilike.%${busca}%,cnpj.ilike.%${busca}%`
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

/**
 * POST /api/empresas   (chave admin)
 * Cadastra uma nova empresa licenciada. O código único da empresa é
 * gerado pela função lic.gerar_codigo_empresa() do banco.
 */
export async function criarEmpresa(
  req: Request,
  res: Response
): Promise<void> {
  const {
    razao_social,
    nome_fantasia,
    cnpj,
    telefone,
    whatsapp,
    email,
    cidade,
    uf,
    observacoes,
    plano_id,
    limite_dispositivos,
  } = req.body as {
    razao_social?: string;
    nome_fantasia?: string;
    cnpj?: string;
    telefone?: string;
    whatsapp?: string;
    email?: string;
    cidade?: string;
    uf?: string;
    observacoes?: string;
    plano_id?: string;
    limite_dispositivos?: number;
  };

  if (!razao_social || !nome_fantasia || !whatsapp) {
    res.status(400).json({
      ok: false,
      erro: "Informe razão social, nome fantasia e WhatsApp.",
    });
    return;
  }

  const {
    data: codigoGerado,
    error: erroCodigo,
  } = await supabase.rpc("gerar_codigo_empresa");

  if (erroCodigo) {
    throw erroCodigo;
  }

  const {
    data,
    error,
  } = await supabase
    .from("empresas")
    .insert({
      codigo: codigoGerado as unknown as string,
      razao_social,
      nome_fantasia,
      cnpj: cnpj || null,
      telefone: telefone || null,
      whatsapp,
      email: email || null,
      cidade: cidade || null,
      uf: uf || null,
      observacoes: observacoes || null,
      plano_id: plano_id || null,
      limite_dispositivos: limite_dispositivos ?? null,
    } as any)
    .select()
    .single();

  if (error) {
    throw error;
  }

  res.json({
    ok: true,
    empresa: data,
  });
}

/**
 * PUT /api/empresas/:id   (chave admin)
 * Atualiza os dados cadastrais de uma empresa já existente.
 */
export async function atualizarEmpresa(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  const {
    razao_social,
    nome_fantasia,
    cnpj,
    telefone,
    whatsapp,
    email,
    cidade,
    uf,
    observacoes,
    plano_id,
    limite_dispositivos,
    status,
  } = req.body as Record<string, any>;

  const campos: Record<string, any> = {};

  if (razao_social !== undefined) campos.razao_social = razao_social;
  if (nome_fantasia !== undefined) campos.nome_fantasia = nome_fantasia;
  if (cnpj !== undefined) campos.cnpj = cnpj || null;
  if (telefone !== undefined) campos.telefone = telefone || null;
  if (whatsapp !== undefined) campos.whatsapp = whatsapp;
  if (email !== undefined) campos.email = email || null;
  if (cidade !== undefined) campos.cidade = cidade || null;
  if (uf !== undefined) campos.uf = uf || null;
  if (observacoes !== undefined) campos.observacoes = observacoes || null;
  if (plano_id !== undefined) campos.plano_id = plano_id || null;
  if (limite_dispositivos !== undefined) campos.limite_dispositivos = limite_dispositivos;
  if (status !== undefined) campos.status = status;

  const {
    data,
    error,
  } = await supabase
    .from("empresas")
    .update(campos as any)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  res.json({ ok: true, empresa: data });
}

/**
 * DELETE /api/empresas/:id   (chave admin)
 * Não apaga a linha do banco (evita perder histórico de licenças
 * vinculadas) — marca a empresa como CANCELADA.
 */
export async function excluirEmpresa(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  const { error } = await supabase
    .from("empresas")
    .update({ status: "CANCELADA" } as any)
    .eq("id", id);

  if (error) {
    throw error;
  }

  res.json({ ok: true });
}