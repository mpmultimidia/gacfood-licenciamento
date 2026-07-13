import { supabase } from "../supabase/conexao.js";

export async function listarModulos() {
  return await supabase
    .from("modulos")
    .select("*");
}

export async function buscarModulo(
  id: string
) {
  return await supabase
    .from("modulos")
    .select("*")
    .eq("id", id)
    .single();
}

export async function criarModulo(
  dados: unknown
) {
  return await supabase
    .from("modulos")
    .insert(dados)
    .select()
    .single();
}