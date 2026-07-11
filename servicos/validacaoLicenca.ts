import { supabase } from "../supabase/conexao.ts";

export async function validarLicencaEmpresa(
  codigo: string
) {
  return await supabase
    .from("licencas")
    .select("*")
    .eq("codigo", codigo)
    .eq("ativa", true)
    .single();
}