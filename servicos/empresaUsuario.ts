import { supabase } from "../supabase/conexao.ts";

export async function listarEmpresasUsuarios() {
  return await supabase
    .from("empresas_usuarios")
    .select("*");
}

export async function buscarEmpresaUsuario(
  id: string
) {
  return await supabase
    .from("empresas_usuarios")
    .select("*")
    .eq("id", id)
    .single();
}

export async function criarEmpresaUsuario(
  dados: unknown
) {
  return await supabase
    .from("empresas_usuarios")
    .insert(dados)
    .select()
    .single();
}