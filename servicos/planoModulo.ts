import { supabase } from "../supabase/conexao.ts";

export async function listarPlanosModulos() {
  return await supabase
    .from("planos_modulos")
    .select("*");
}

export async function buscarPlanoModulo(
  id: string
) {
  return await supabase
    .from("planos_modulos")
    .select("*")
    .eq("id", id)
    .single();
}

export async function criarPlanoModulo(
  dados: unknown
) {
  return await supabase
    .from("planos_modulos")
    .insert(dados)
    .select()
    .single();
}