import "dotenv/config";

function obrigatoria(nome: string): string {
  const valor = process.env[nome];

  if (!valor || valor.trim() === "") {
    throw new Error(
      `Variável de ambiente "${nome}" não definida.`
    );
  }

  return valor;
}

function opcionalNumero(
  nome: string,
  padrao: number
): number {
  const valor = process.env[nome];

  if (!valor) {
    return padrao;
  }

  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : padrao;
}

export const ambiente = {
  supabaseUrl:
    obrigatoria("SUPABASE_URL"),

  supabaseServiceRoleKey:
    obrigatoria(
      "SUPABASE_SERVICE_ROLE_KEY"
    ),

  porta:
    opcionalNumero(
      "PORT",
      3002
    ),

  ambienteExecucao:
    process.env.NODE_ENV ??
    "development",

  apiKeyCliente:
    obrigatoria(
      "API_KEY_CLIENTE"
    ),

  apiKeyAdmin:
    obrigatoria(
      "API_KEY_ADMIN"
    ),

  painelUrl:
    process.env.PAINEL_URL ??
    "",

  licencaDiasValidadePadrao:
    opcionalNumero(
      "LICENCA_DIAS_VALIDADE",
      30
    ),

  codigoAtivacaoMinutosValidade:
    opcionalNumero(
      "CODIGO_ATIVACAO_MINUTOS",
      10
    ),
} as const;