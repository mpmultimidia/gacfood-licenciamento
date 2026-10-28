// licenciamento/renovacao.ts
import { supabase } from "../supabase/conexao.js";
import { garantirCredenciaisRestaurante } from "../supabase/authRestaurante.js";
import { listarFuncionalidadesDoPlano } from "../servicos/funcionalidadesPlano.js";
import { ambiente } from "../config/ambiente.js";
import { verificarERegistrarDispositivo } from "./dispositivos.js";

function gerarCodigoAtivacaoTexto(): string {
  let codigo = "";
  for (let i = 0; i < 6; i++) {
    codigo += Math.floor(Math.random() * 10).toString();
  }
  return codigo;
}

/**
 * Passo 1: gera um código de ativação de 6 dígitos para uma empresa
 * (identificada pelo código dela, não da licença). Usado pela tela de
 * Empresas/Licenças do painel quando você quer entregar um código pro
 * cliente digitar na primeira abertura do GACFOOD dele.
 */
export async function solicitarCodigoDeAtivacao(codigoEmpresa: string) {
  const { data: empresa, error: erroEmpresa } = await supabase
    .from("empresas")
    .select("id, codigo, nome_fantasia")
    .eq("codigo", codigoEmpresa)
    .single();

  if (erroEmpresa || !empresa) {
    throw new Error("Empresa não encontrada.");
  }

  const codigo = gerarCodigoAtivacaoTexto();
  const minutos = ambiente.codigoAtivacaoMinutosValidade;
  const expiraEm = new Date(Date.now() + minutos * 60_000).toISOString();

  const { data: codigoAtivacao, error: erroCodigo } = await supabase
    .from("codigos_ativacao")
    .insert({
      empresa_id: (empresa as any).id,
      codigo,
      expira_em: expiraEm,
    })
    .select()
    .single();

  if (erroCodigo) throw erroCodigo;

  return { empresa, codigoAtivacao };
}

/**
 * Passo 2: o GACFOOD local chama isso com o código de 6 dígitos digitado
 * pelo cliente. Resolve a empresa, confirma que ela tem uma licença ativa,
 * marca o código como usado, checa/registra o dispositivo, e devolve TUDO
 * que o GACFOOD precisa gravar no .env desta instalação.
 *
 * hashDispositivo agora é OBRIGATÓRIO — sem ele não há como aplicar o
 * limite de dispositivos contratado. O main.js precisa enviar isso (ver
 * arquivo corrigido em conjunto com esta mudança).
 */
export async function ativarOuRenovarLicenca(
  codigoAtivacao: string,
  opcoes: { hashDispositivo?: string } = {}
) {
  if (!codigoAtivacao) {
    throw new Error("Código de ativação não informado.");
  }

  if (!opcoes.hashDispositivo) {
    throw new Error(
      "Identificação do dispositivo não informada. Atualize o GACFOOD para a versão mais recente."
    );
  }

  const { data: registro, error: erroBusca } = await supabase
    .from("codigos_ativacao")
    .select("id, empresa_id, expira_em, utilizado")
    .eq("codigo", codigoAtivacao)
    .order("criado_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (erroBusca || !registro) {
    throw new Error("Código de ativação inválido.");
  }

  if ((registro as any).utilizado) {
    throw new Error("Este código de ativação já foi utilizado.");
  }

  if (new Date((registro as any).expira_em).getTime() < Date.now()) {
    throw new Error("Este código de ativação expirou. Peça um código novo.");
  }

  const { data: empresa, error: erroEmpresa } = await supabase
    .from("empresas")
    .select("id, codigo, nome_fantasia, limite_dispositivos")
    .eq("id", (registro as any).empresa_id)
    .single();

  if (erroEmpresa || !empresa) {
    throw new Error("Empresa vinculada a este código não foi encontrada.");
  }

  const { data: licenca, error: erroLicenca } = await supabase
    .from("licencas")
    .select("*")
    .eq("empresa_id", (empresa as any).id)
    .eq("status", "ATIVA")
    .order("emitida_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (erroLicenca || !licenca) {
    throw new Error("Esta empresa não possui uma licença ativa no momento.");
  }

  // Checa o limite de dispositivos ANTES de consumir o código de ativação
  // — se recusar aqui, o código de 6 dígitos continua válido para o
  // cliente tentar de novo depois de resolver a situação (ex: liberar
  // um dispositivo antigo), em vez de queimar o código à toa.
  await verificarERegistrarDispositivo(
    (licenca as any).id,
    (empresa as any).limite_dispositivos ?? 1,
    opcoes.hashDispositivo
  );

  // Marca o código de 6 dígitos como usado — não pode ser reaproveitado.
  await supabase
    .from("codigos_ativacao")
    .update({ utilizado: true, utilizado_em: new Date().toISOString() })
    .eq("id", (registro as any).id);

  await supabase
    .from("licencas")
    .update({
      ultima_validacao: new Date().toISOString(),
      hash_dispositivo: opcoes.hashDispositivo,
    })
    .eq("id", (licenca as any).id);

  const credenciais = await garantirCredenciaisRestaurante({
    nomeEmpresa: (empresa as any).nome_fantasia,
    codigoLicenca: (licenca as any).codigo_licenca,
    gerarNovaSenha: true,
  });

  const modulos = await listarFuncionalidadesDoPlano((licenca as any).plano_id);

  return {
    codigo_licenca: (licenca as any).codigo_licenca,
    versao: (licenca as any).versao,
    emitida_em: (licenca as any).emitida_em,
    expira_em: (licenca as any).expira_em,
    status: (licenca as any).status,
    modulos,
    credenciais,
  };
}

// Mantidas por compatibilidade, caso alguma outra tela ainda use estes
// utilitários simples de data (não fazem nenhuma consulta ao banco).
export function verificarRenovacao(vencimento: Date): boolean {
  return vencimento.getTime() <= Date.now();
}

export function renovarLicenca(dias: number): Date {
  const novaData = new Date();
  novaData.setDate(novaData.getDate() + dias);
  return novaData;
}
