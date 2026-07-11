import { supabase } from "../supabase/conexao.ts";

export async function listarUsuariosPermissoes() {
  return await supabase
    .from("usuarios_permissoes")
    .select("*");
}

export async function buscarUsuarioPermissao(
  id: string
) {
  return await supabase
    .from("usuarios_permissoes")
    .select("*")
    .eq("id", id)
    .single();
}

export async function criarUsuarioPermissao(
  dados: unknown
) {
  return await supabase
    .from("usuarios_permissoes")
    .insert(dados)
    .select()
    .single();
}