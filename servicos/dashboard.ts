import { supabase } from "../supabase/conexao.js";

export interface ReceitaPorPlano {
  plano_id: string;
  plano_nome: string;
  valor_unitario: number;
  quantidade_licencas: number;
  total: number;
}

export async function resumoSistema() {
  const [
    empresas,
    usuarios,
    licencas,
    planos,
    licencasAtivas,
  ] = await Promise.all([
    supabase.from("empresas").select("id"),
    supabase.from("usuarios").select("id"),
    supabase.from("licencas").select("id"),
    supabase.from("planos").select("id, nome, valor"),
    supabase.from("licencas").select("plano_id").eq("status", "ATIVA"),
  ]);

  // ─── Receita por plano ───────────────────────────────────────────────
  // Conta quantas licenças ATIVAS existem em cada plano e multiplica pelo
  // valor do plano — ex.: 2 licenças no plano Básico (R$ 50) = R$ 100.
  const contagemPorPlano = new Map<string, number>();

  for (const linha of licencasAtivas.data ?? []) {
    const planoId = (linha as any).plano_id as string | null;
    if (!planoId) continue;
    contagemPorPlano.set(planoId, (contagemPorPlano.get(planoId) ?? 0) + 1);
  }

  const receitaPorPlano: ReceitaPorPlano[] = (planos.data ?? [])
    .map((plano: any) => {
      const quantidade = contagemPorPlano.get(plano.id) ?? 0;
      const valorUnitario = Number(plano.valor) || 0;

      return {
        plano_id: plano.id,
        plano_nome: plano.nome,
        valor_unitario: valorUnitario,
        quantidade_licencas: quantidade,
        total: valorUnitario * quantidade,
      };
    })
    // só mostra planos com pelo menos 1 licença ativa — evita poluir o
    // dashboard com planos que ninguém contratou ainda.
    .filter((linha) => linha.quantidade_licencas > 0)
    .sort((a, b) => b.total - a.total);

  const receitaTotal = receitaPorPlano.reduce(
    (soma, linha) => soma + linha.total,
    0
  );

  return {
    empresas: empresas.data?.length || 0,
    usuarios: usuarios.data?.length || 0,
    licencas: licencas.data?.length || 0,
    planos: planos.data?.length || 0,
    receitaPorPlano,
    receitaTotal,
  };
}
