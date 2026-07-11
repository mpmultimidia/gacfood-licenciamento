import { supabase } from "../supabase/conexao.ts";

export async function salvarConfiguracao(
  chave: string,
  valor: unknown
) {
  return await supabase
    .from("configuracoes")
    .upsert({
      chave,
      valor
    })
    .select()
    .single();
}

export async function buscarConfiguracao(
  chave: string
) {
  return await supabase
    .from("configuracoes")
    .select("*")
    .eq("chave", chave)
    .single();
}

export async function listarConfiguracoes() {
  return await supabase
    .from("configuracoes")
    .select("*");
}