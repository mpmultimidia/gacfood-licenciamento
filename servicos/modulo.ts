import { supabase } from "../supabase/conexao.js";

// CORREÇÃO: a tabela real no banco chama-se "funcionalidades" (é o que o
// resto do sistema — plano_funcionalidades — já usa). O código antigo
// apontava para uma tabela "modulos" que nunca existiu.

export async function listarModulos() {
  const { data, error } = await supabase
    .from("funcionalidades")
    .select("*")
    .order("nome");

  if (error) throw error;

  return (data ?? []).map((f: any) => ({
    id: f.id,
    codigo: f.codigo,
    nome: f.nome,
    descricao: f.descricao,
    status: f.ativo ? "ATIVO" : "INATIVO",
  }));
}

export async function buscarModulo(id: string) {
  const { data, error } = await supabase
    .from("funcionalidades")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function criarModulo(dados: any) {
  const { nome, descricao, codigo, status } = dados as {
    nome?: string;
    descricao?: string;
    codigo?: string;
    status?: string;
  };

  if (!nome) {
    const erro: any = new Error("Informe o nome do módulo.");
    erro.status = 400;
    throw erro;
  }

  const codigoGerado =
    codigo ||
    nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  const { data, error } = await supabase
    .from("funcionalidades")
    .insert({
      codigo: codigoGerado,
      nome,
      descricao: descricao || "",
      ativo: status ? status === "ATIVO" : true,
    } as any)
    .select()
    .single();

  if (error) throw error;
  return { ok: true, modulo: data };
}

export async function atualizarModulo(id: string, dados: any) {
  const { nome, descricao, status } = dados as {
    nome?: string;
    descricao?: string;
    status?: string;
  };

  const campos: Record<string, any> = {};
  if (nome !== undefined) campos.nome = nome;
  if (descricao !== undefined) campos.descricao = descricao;
  if (status !== undefined) campos.ativo = status === "ATIVO";

  const { data, error } = await supabase
    .from("funcionalidades")
    .update(campos)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { ok: true, modulo: data };
}

export async function excluirModulo(id: string) {
  // Não apaga a linha — só desativa (evita quebrar planos que já usam
  // este módulo via plano_funcionalidades).
  const { error } = await supabase
    .from("funcionalidades")
    .update({ ativo: false } as any)
    .eq("id", id);

  if (error) throw error;
  return { ok: true };
}
