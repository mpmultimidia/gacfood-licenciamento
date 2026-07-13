import { supabase } from "../supabase/conexao.js";

export async function registrarEventoSistema(
  evento: string,
  detalhes?: unknown
) {
  return await supabase
    .from("logs_sistema")
    .insert({
      evento,
      detalhes,
      criado_em: new Date()
    })
    .select()
    .single();
}

export async function listarLogsSistema() {
  return await supabase
    .from("logs_sistema")
    .select("*")
    .order("criado_em", {
      ascending: false
    });
}