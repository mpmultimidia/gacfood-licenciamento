import { supabase } from "../supabase/conexao.ts";

export async function listarPermissoes() {
  return await supabase
    .from("permissoes")
    .select("*");
}

export async function buscarPermissao(
  id: string
) {
  return await supabase
    .from("permissoes")
    .select("*")
    .eq("id", id)
    .single();
}

export async function criarPermissao(
  dados: unknown
) {
  return await supabase
    .from("permissoes")
    .insert(dados)
    .select()
    .single();
}