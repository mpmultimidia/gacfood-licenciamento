import { supabase } from "../supabase/conexao.js";

export async function verificarPermissao(
  usuarioId: string,
  modulo: string
) {
  const resultado = await supabase
    .from("usuarios_permissoes")
    .select("*")
    .eq("usuario_id", usuarioId)
    .eq("modulo", modulo)
    .single();

  return {
    permitido: !!resultado.data,
    dados: resultado.data
  };
}