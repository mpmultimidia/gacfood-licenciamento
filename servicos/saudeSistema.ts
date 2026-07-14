import { supabase } from "../supabase/conexao.js";

export async function verificarSaudeBanco(): Promise<{ ok: boolean; erro?: string }> {
  try {
    const { error } = await supabase
      .from("empresas")
      .select("id")
      .limit(1);

    if (error) return { ok: false, erro: error.message };
    return { ok: true };
  } catch (erro) {
    return { ok: false, erro: erro instanceof Error ? erro.message : "Erro desconhecido" };
  }
}

export async function verificarSaudeLicenciamento(): Promise<{ ok: boolean; erro?: string }> {
  try {
    const { error } = await supabase
      .from("licencas")
      .select("id")
      .limit(1);

    if (error) return { ok: false, erro: error.message };
    return { ok: true };
  } catch (erro) {
    return { ok: false, erro: erro instanceof Error ? erro.message : "Erro desconhecido" };
  }
}