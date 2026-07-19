import bcrypt from "bcryptjs";
import { supabase } from "../supabase/conexao.js";

export async function listarUsuarios() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nome, login, perfil, ativo, criado_em")
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
    .select("id, nome, login, perfil, ativo, criado_em")
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
  const { nome, login, senha, perfil } = dados as {
    nome?: string;
    login?: string;
    senha?: string;
    perfil?: string;
  };

  if (!nome || !login || !senha) {
    const erro: any = new Error("Informe nome, login e senha.");
    erro.status = 400;
    throw erro;
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const { data, error } = await supabase
    .from("usuarios")
    .insert({
      nome,
      login,
      senha: senhaHash,
      perfil: perfil || "operador",
    } as any)
    .select("id, nome, login, perfil, ativo, criado_em")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function atualizarUsuario(
  id: string,
  dados: any
) {
  const { nome, login, senha, perfil, ativo } = dados as {
    nome?: string;
    login?: string;
    senha?: string;
    perfil?: string;
    ativo?: boolean;
  };

  const campos: Record<string, any> = {};
  if (nome !== undefined) campos.nome = nome;
  if (login !== undefined) campos.login = login;
  if (perfil !== undefined) campos.perfil = perfil;
  if (ativo !== undefined) campos.ativo = ativo;

  // Só troca a senha se uma nova senha foi enviada — nunca sobrescreve
  // com vazio/undefined.
  if (senha) {
    campos.senha = await bcrypt.hash(senha, 10);
  }

  const { data, error } = await supabase
    .from("usuarios")
    .update(campos)
    .eq("id", id)
    .select("id, nome, login, perfil, ativo, criado_em")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function excluirUsuario(
  id: string
) {
  // Não apaga a linha — só desativa o acesso.
  const { error } = await supabase
    .from("usuarios")
    .update({ ativo: false } as any)
    .eq("id", id);

  if (error) {
    throw error;
  }

  return { ok: true };
}

// Confere login + senha para o login do painel (usuários secundários,
// não o MASTER). Devolve os dados do usuário (sem a senha) se estiver
// tudo certo e o usuário estiver ativo, ou null se não bater.
export async function autenticarUsuario(
  login: string,
  senha: string
) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("login", login)
    .eq("ativo", true)
    .single();

  if (error || !data) {
    return null;
  }

  const senhaOk = await bcrypt.compare(
    senha,
    (data as any).senha
  );

  if (!senhaOk) {
    return null;
  }

  const usuarioSemSenha = { ...data };
  delete (usuarioSemSenha as any).senha;

  return usuarioSemSenha;
}
