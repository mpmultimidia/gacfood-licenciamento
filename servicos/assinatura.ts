import { supabase } from "../supabase/conexao.ts";

export async function listarAssinaturas() {
  return await supabase
    .from("assinaturas")
    .select("*");
}

export async function buscarAssinatura(
  id: string
) {
  return await supabase
    .from("assinaturas")
    .select("*")
    .eq("id", id)
    .single();
}

export async function criarAssinatura(
  dados: unknown
) {
  return await supabase
    .from("assinaturas")
    .insert(dados)
    .select()
    .single();
}