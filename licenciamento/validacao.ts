import { supabase } from "../supabase/conexao.js";

export class ErroValidacao extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErroValidacao";
  }
}

export function validarLicenca(
  codigo: string
): boolean {
  if (!codigo) {
    return false;
  }

  return codigo.length >= 10;
}

export async function buscarEmpresaPorCodigo(
  codigo: string
) {
  if (!codigo) {
    throw new ErroValidacao(
      "Código da empresa não informado."
    );
  }

  const { data, error } = await supabase
    .from("empresas")
    .select(
      "codigo,nome_fantasia,status"
    )
    .eq("codigo", codigo)
    .single();

  if (error || !data) {
    throw new ErroValidacao(
      "Empresa não encontrada."
    );
  }

  return data;
}

export async function buscarLicencaAtivaDaEmpresa(
  empresaId: string
) {
  if (!empresaId) {
    throw new ErroValidacao(
      "Empresa não informada."
    );
  }

  // Se houver mais de uma licença ATIVA (ex.: renovação emitida sem
  // cancelar a anterior), usa a mais recente em vez de falhar.
  const { data, error } = await supabase
    .from("licencas")
    .select("*")
    .eq("empresa_id", empresaId)
    .eq("status", "ATIVA")
    .order("emitida_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    throw new ErroValidacao(
      "Licença ativa não encontrada."
    );
  }

  return data;
}

export function licencaEstaValida(
  licenca: any
): boolean {
  if (!licenca) {
    return false;
  }

  // Só licença com status ATIVA vale (cancelada, suspensa ou qualquer
  // outro status bloqueia).
  if (licenca.status !== "ATIVA") {
    return false;
  }

  // A coluna de vencimento no banco é "expira_em" ("vencimento" fica como
  // alternativa por compatibilidade).
  const vencimento = licenca.expira_em ?? licenca.vencimento;

  if (vencimento) {
    const quando = new Date(vencimento).getTime();

    if (Number.isNaN(quando)) {
      return false;
    }

    return quando > Date.now();
  }

  return true;
}
