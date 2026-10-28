import { supabase } from "../supabase/conexao.js";
import { listarFuncionalidadesDoPlano } from "./funcionalidadesPlano.js";
import { verificarERegistrarDispositivo, ErroLimiteDispositivos } from "../licenciamento/dispositivos.js";

// Exige a identificação do dispositivo em TODA validação (ERP e TRUCK).
// Sem ela não há como controlar o número de aparelhos contratado.
// Só para dar tempo dos clientes atualizarem o app, é possível criar na
// Vercel a variável EXIGIR_DISPOSITIVO com o valor "false" (temporário).
// Depois da transição, apague essa variável.
const EXIGIR_DISPOSITIVO = process.env.EXIGIR_DISPOSITIVO !== "false";

/**
 * Valida a licença de uma empresa. A licença só é aceita se:
 *  - existir com status ATIVA e não estiver vencida (expira_em);
 *  - a empresa estiver com status ATIVA;
 *  - o dispositivo for informado e couber no limite contratado.
 * Em qualquer outro caso devolve { data: null, error }.
 * Falhas de banco/rede NÃO são devolvidas como "licença inativa": são
 * lançadas, para a rota responder erro 500 e o app manter o último resultado.
 */
export async function validarLicencaEmpresa(codigo: string, hashDispositivo?: string) {
  const resultado = await supabase
    .from("licencas")
    .select("*")
    .eq("codigo_licenca", codigo)
    .eq("status", "ATIVA")
    .order("emitida_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (resultado.error) {
    throw resultado.error;
  }

  if (!resultado.data) {
    return {
      data: null,
      error: { message: "Licença não encontrada, cancelada ou vencida." },
    };
  }

  const licenca = resultado.data as any;

  // Vencimento
  if (licenca.expira_em) {
    const expira = new Date(licenca.expira_em).getTime();

    if (Number.isNaN(expira) || expira < Date.now()) {
      return { data: null, error: { message: "Licença vencida." } };
    }
  }

  // Empresa
  const { data: empresa, error: erroEmpresa } = await supabase
    .from("empresas")
    .select("limite_dispositivos, status")
    .eq("id", licenca.empresa_id)
    .single();

  if (erroEmpresa) {
    throw erroEmpresa;
  }

  if (!empresa) {
    return { data: null, error: { message: "Empresa não encontrada." } };
  }

  const statusEmpresa = (empresa as any).status;

  if (statusEmpresa && String(statusEmpresa).toUpperCase() !== "ATIVA") {
    return { data: null, error: { message: "Empresa inativa ou suspensa." } };
  }

  // Dispositivo
  if (!hashDispositivo && EXIGIR_DISPOSITIVO) {
    return {
      data: null,
      error: {
        message: "Identificação do dispositivo não informada. Atualize o GACFOOD para a versão mais recente.",
      },
    };
  }

  if (hashDispositivo) {
    try {
      await verificarERegistrarDispositivo(
        licenca.id,
        (empresa as any).limite_dispositivos ?? 1,
        hashDispositivo
      );
    } catch (erroLimite: any) {
      if (erroLimite instanceof ErroLimiteDispositivos) {
        return { data: null, error: { message: erroLimite.message } };
      }
      throw erroLimite;
    }
  }

  // Módulos liberados pelo plano desta licença.
  const modulos = await listarFuncionalidadesDoPlano(licenca.plano_id);

  return {
    data: {
      ...licenca,
      modulos,
    },
    error: null,
  };
}
