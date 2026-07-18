// licenciamento/codigoAtivacao.ts
import { supabase } from "../supabase/conexao.js";
import { ambiente } from "../config/ambiente.js";

function gerarCodigoNumerico(tamanho = 6): string {
  let codigo = "";
  for (let i = 0; i < tamanho; i++) {
    codigo += Math.floor(Math.random() * 10).toString();
  }
  return codigo;
}

/**
 * Gera um código de ativação de 6 dígitos para uma empresa específica.
 * Válido por N minutos (ambiente.codigoAtivacaoMinutosValidade", padrão 10).
 * Chamado pelo painel quando você quer entregar um código pro cliente
 * digitar na primeira abertura do GACFOOD dele.
 */
export async function gerarCodigoAtivacao(empresaId: string): Promise<{
  codigo: string;
  expira_em: string;
}> {
  const codigo = gerarCodigoNumerico(6);
  const minutos = ambiente.codigoAtivacaoMinutosValidade;
  const expiraEm = new Date(Date.now() + minutos * 60_000).toISOString();

  const { data, error } = await supabase
    .from("codigos_ativacao")
    .insert({
      empresa_id: empresaId,
      codigo,
      expira_em: expiraEm,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    codigo: (data as any).codigo,
    expira_em: (data as any).expira_em,
  };
}

/**
 * Troca um código de 6 dígitos (digitado pelo cliente na primeira abertura
 * do GACFOOD) pelo código de licença permanente da empresa vinculada.
 * Marca o código como usado — não pode ser reaproveitado.
 */
export async function resgatarCodigoAtivacao(codigo: string): Promise<string> {
  const { data, error } = await supabase
    .from("codigos_ativacao")
    .select("id, empresa_id, expira_em, utilizado")
    .eq("codigo", codigo)
    .order("criado_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Código de ativação inválido.");
  }

  if ((data as any).utilizado) {
    throw new Error("Este código de ativação já foi utilizado.");
  }

  if (new Date((data as any).expira_em).getTime() < Date.now()) {
    throw new Error("Este código de ativação expirou. Peça um código novo.");
  }

  const { data: empresa, error: erroEmpresa } = await supabase
    .from("empresas")
    .select("codigo")
    .eq("id", (data as any).empresa_id)
    .single();

  if (erroEmpresa || !empresa) {
    throw new Error("Empresa vinculada a este código não foi encontrada.");
  }

  await supabase
    .from("codigos_ativacao")
    .update({ utilizado: true, utilizado_em: new Date().toISOString() })
    .eq("id", (data as any).id);

  return (empresa as any).codigo;
}
