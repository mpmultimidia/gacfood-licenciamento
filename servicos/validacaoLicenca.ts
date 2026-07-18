import { supabase } from "../supabase/conexao.js";
import { listarFuncionalidadesDoPlano } from "./funcionalidadesPlano.js";

// CORREÇÃO: esta função consultava as colunas "codigo" e "ativa", que não
// existem na tabela lic.licencas" (as colunas reais são "codigo_licenca"
// e "status"). Isso fazia TODA validação de licença falhar silenciosamente
// (a consulta retornava erro/vazio, e o GACFOOD instalado interpretava
// isso como "licença inativa" a cada checagem periódica).
export async function validarLicencaEmpresa(codigo: string) {
  const resultado = await supabase
    .from("licencas")
    .select("*")
    .eq("codigo_licenca", codigo)
    .eq("status", "ATIVA")
    .single();

  if (resultado.error || !resultado.data) {
    return resultado;
  }

  // Resolve quais módulos o plano desta licença libera, e devolve junto —
  // é isso que o GACFOOD instalado usa para mostrar/esconder telas e
  // liberar/bloquear rotas conforme o plano contratado.
  const modulos = await listarFuncionalidadesDoPlano((resultado.data as any).plano_id);

  return {
    data: {
      ...resultado.data,
      modulos,
    },
    error: null,
  };
}
