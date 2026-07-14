import { supabase } from "../supabase/conexao.js";

export async function verificarSaudeBanco(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("empresas")
      .select("id")
      .limit(1);

    return !error;
  } catch {
    return false;
  }
}

export async function verificarSaudeLicenciamento(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("licencas")
      .select("id")
      .limit(1);

    return !error;
  } catch {
    return false;
  }
}