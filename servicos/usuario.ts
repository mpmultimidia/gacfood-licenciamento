import bcrypt from "bcrypt";
import { supabase } from "../supabase/conexao.ts";

export async function listarUsuarios() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .order("criado_em", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function buscarUsuario(
  id: string
) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function criarUsuario(
  dados: any
) {
  // NOVO: nunca grava a senha em texto puro — sempre em hash (bcrypt).
  // Antes, `dados` ia direto pro insert com a senha do jeito que chegou.
  const dadosParaGravar = { ...dados };

  if (dadosParaGravar.senha) {
    dadosParaGravar.senha = await bcrypt.hash(
      dadosParaGravar.senha,
      10
    );
  }

  const { data, error } = await supabase
    .from("usuarios")
    .insert(dadosParaGravar)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Nunca devolve o hash da senha pro front-end.
  if (data) {
    delete (data as any).senha;
  }

  return data;
}

// NOVO: confere e-mail + senha para o login do painel. Devolve os dados do
// usuário (sem a senha) se estiver correto, ou null se não bater.
export async function autenticarUsuario(
  email: string,
  senha: string
) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    return null;
  }

  if (!data.senha) {
    // Usuário sem senha cadastrada (ex: criado antes desta correção) —
    // não dá pra autenticar com segurança.
    return null;
  }

  const senhaOk = await bcrypt.compare(
    senha,
    data.senha
  );

  if (!senhaOk) {
    return null;
  }

  const usuarioSemSenha = { ...data };
  delete usuarioSemSenha.senha;

  return usuarioSemSenha;
}
