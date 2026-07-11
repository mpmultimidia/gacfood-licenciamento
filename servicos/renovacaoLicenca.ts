import { supabase } from "../supabase/conexao.ts";

export async function renovarLicenca(
  id: string,
  novaData: string
) {
  return await supabase
    .from("licencas")
    .update({
      vencimento: novaData,
      ativa: true
    })
    .eq("id", id)
    .select()
    .single();
}