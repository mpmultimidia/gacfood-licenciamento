import { supabase } from "../supabase/conexao.js";

export async function listarLicencas() {
  return await supabase
    .from("licencas")
    .select("*");
}

export async function buscarLicenca(
  id: string
) {
  return await supabase
    .from("licencas")
    .select("*")
    .eq("id", id)
    .single();
}

export async function criarLicenca(
  dados: unknown
) {
  return await supabase
    .from("licencas")
    .insert(dados)
    .select()
    .single();
}