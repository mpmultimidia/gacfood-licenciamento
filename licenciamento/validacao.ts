import { supabase } from "../supabase/conexao.ts";

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

  const { data, error } = await supabase
    .from("licencas")
    .select("*")
    .eq("empresa_id", empresaId)
    .eq("status", "ATIVA")
    .single();

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

  if (
    licenca.status &&
    licenca.status !== "ATIVA"
  ) {
    return false;
  }

  if (licenca.vencimento) {
    return (
      new Date(licenca.vencimento).getTime() >
      Date.now()
    );
  }

  return true;
}