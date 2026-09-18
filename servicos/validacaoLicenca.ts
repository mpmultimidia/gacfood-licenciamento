import { supabase } from "../supabase/conexao.js";
import { listarFuncionalidadesDoPlano } from "./funcionalidadesPlano.js";
import { verificarERegistrarDispositivo } from "../licenciamento/dispositivos.js";

// CORREÇÃO: esta função consultava as colunas "codigo" e "ativa", que não
// existem na tabela lic.licencas" (as colunas reais são "codigo_licenca"
// e "status"). Isso fazia TODA validação de licença falhar silenciosamente
// (a consulta retornava erro/vazio, e o GACFOOD instalado interpretava
// isso como "licença inativa" a cada checagem periódica).
//
// CORREÇÃO (limite de dispositivos): esta rota é usada tanto pelo GACFOOD
// ERP (checagem periódica, sem hashDispositivo — já foi registrado antes
// via /api/licencas/ativar) quanto pelo GACFOOD TRUCK (celular, que não
// tem uma etapa de "ativação com credenciais" separada — pra ele, esta
// PRÓPRIA chamada de validação é o momento de registrar o dispositivo).
// Por isso: se vier um hashDispositivo, o limite da empresa é checado e o
// dispositivo é registrado/atualizado aqui também, usando a mesma lógica
// compartilhada com o lado do ERP. Se não vier hash (chamada antiga do
// ERP), o comportamento continua exatamente como já era.
export async function validarLicencaEmpresa(codigo: string, hashDispositivo?: string) {
  const resultado = await supabase
    .from("licencas")
    .select("*")
    .eq("codigo_licenca", codigo)
    .eq("status", "ATIVA")
    .single();

  if (resultado.error || !resultado.data) {
    return resultado;
  }

  if (hashDispositivo) {
    const { data: empresa, error: erroEmpresa } = await supabase
      .from("empresas")
      .select("limite_dispositivos")
      .eq("id", (resultado.data as any).empresa_id)
      .single();

    if (erroEmpresa || !empresa) {
      return { data: null, error: erroEmpresa || new Error("Empresa não encontrada.") };
    }

    try {
      await verificarERegistrarDispositivo(
        (resultado.data as any).id,
        (empresa as any).limite_dispositivos ?? 1,
        hashDispositivo
      );
    } catch (erroLimite: any) {
      // Mesmo formato de erro que uma falha de consulta ao Supabase, pra
      // quem chama esta função não precisar tratar dois formatos
      // diferentes de erro.
      return { data: null, error: { message: erroLimite.message } };
    }
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
