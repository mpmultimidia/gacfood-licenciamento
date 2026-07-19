// servicos/ativacaoAutomatica.ts
//
// Usado pelo GACFOOD instalado (src/servicos/licenciamento-servico.ts,
// função ativarLicencaSeNecessario) na primeira vez que o servidor local
// sobe com o código de licença já configurado no .env, mas ainda sem
// credenciais do Supabase. Devolve as credenciais dessa instalação para
// o servidor gravar no próprio .env — sem precisar do fluxo de código
// de 6 dígitos (esse aqui usa direto o código permanente da licença).
import { supabase } from "../supabase/conexao.js";
import { garantirCredenciaisRestaurante } from "../supabase/authRestaurante.js";

export async function ativarPorCodigoDeLicenca(codigoLicenca: string) {
  const { data: licenca, error: erroLicenca } = await supabase
    .from("licencas")
    .select("id, empresa_id, codigo_licenca, status")
    .eq("codigo_licenca", codigoLicenca)
    .eq("status", "ATIVA")
    .maybeSingle();

  if (erroLicenca || !licenca) {
    const erro: any = new Error("Licença não encontrada ou inativa.");
    erro.status = 404;
    throw erro;
  }

  const { data: empresa, error: erroEmpresa } = await supabase
    .from("empresas")
    .select("nome_fantasia")
    .eq("id", (licenca as any).empresa_id)
    .single();

  if (erroEmpresa || !empresa) {
    const erro: any = new Error("Empresa vinculada à licença não encontrada.");
    erro.status = 404;
    throw erro;
  }

  // gerarNovaSenha: false — este endpoint pode ser chamado mais de uma
  // vez (reinício do servidor antes de gravar o .env, por exemplo) e
  // NUNCA deve invalidar uma senha já entregue à toa. Se as credenciais
  // já existirem (por este fluxo ou pelo de código de 6 dígitos), a
  // senha volta como null e a instalação simplesmente ignora (mantém o
  // que já tem).
  const credenciais = await garantirCredenciaisRestaurante({
    nomeEmpresa: (empresa as any).nome_fantasia,
    codigoLicenca,
    gerarNovaSenha: false,
  });

  return credenciais;
}
