// servicos/funcionalidadesPlano.ts
import { supabase } from "../supabase/conexao.js";

/**
 * Retorna os códigos das funcionalidades (módulos) liberadas por um plano —
 * só as que estão habilitado=true" na tabela e que a própria funcionalidade
 * está ativo=true" (permite desativar uma funcionalidade globalmente sem
 * precisar mexer em cada plano).
 */
export async function listarFuncionalidadesDoPlano(planoId: string | null | undefined): Promise<string[]> {
  if (!planoId) return [];

  const { data, error } = await supabase
    .from("plano_funcionalidades")
    .select("habilitado, funcionalidades(codigo, ativo)")
    .eq("plano_id", planoId)
    .eq("habilitado", true);

  if (error || !data) return [];

  return (data as any[])
    .filter((linha) => linha.funcionalidades?.ativo)
    .map((linha) => linha.funcionalidades.codigo as string);
}
