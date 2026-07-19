import { supabase } from "../supabase/conexao.js";

export interface ReceitaPorPlano {
  plano_id: string;
  plano_nome: string;
  valor_unitario: number;
  quantidade_licencas: number;
  total: number;
}

export async function resumoSistema(periodo?: { inicio?: string; fim?: string }) {
  const [
    empresas,
    usuarios,
    licencas,
    planos,
    licencasAtivas,
    licencasCanceladas,
  ] = await Promise.all([
    supabase.from("empresas").select("id"),
    supabase.from("usuarios").select("id"),
    supabase.from("licencas").select("id"),
    supabase.from("planos").select("id, nome, valor"),
    supabase.from("licencas").select("plano_id").eq("status", "ATIVA"),
    supabase.from("licencas").select("id").eq("status", "CANCELADA"),
  ]);

  // ─── Receita por plano (situação atual — só licenças ATIVAS) ─────────
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
    .filter((linha) => linha.quantidade_licencas > 0)
    .sort((a, b) => b.total - a.total);

  const receitaTotal = receitaPorPlano.reduce(
    (soma, linha) => soma + linha.total,
    0
  );

  // ─── Movimentação no período (para acompanhar evolução comercial) ────
  // Usa o histórico (historico_licencas), que registra o momento exato de
  // cada emissão e cancelamento — diferente da tabela licencas", que só
  // guarda o status atual.
  const movimentacao = await calcularMovimentacaoPeriodo(periodo);

  return {
    empresas: empresas.data?.length || 0,
    usuarios: usuarios.data?.length || 0,
    licencas: licencas.data?.length || 0,
    licencasCanceladas: licencasCanceladas.data?.length || 0,
    planos: planos.data?.length || 0,
    receitaPorPlano,
    receitaTotal,
    movimentacao,
  };
}

async function calcularMovimentacaoPeriodo(periodo?: { inicio?: string; fim?: string }) {
  // Sem período informado, olha os últimos 30 dias por padrão.
  const fim = periodo?.fim ? new Date(periodo.fim + "T23:59:59") : new Date();
  const inicio = periodo?.inicio
    ? new Date(periodo.inicio + "T00:00:00")
    : new Date(fim.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [empresasNoPeriodo, historicoNoPeriodo] = await Promise.all([
    supabase
      .from("empresas")
      .select("id")
      .gte("criado_em", inicio.toISOString())
      .lte("criado_em", fim.toISOString()),
    supabase
      .from("historico_licencas")
      .select("motivo, licenca_id, codigo_licenca, criado_em, licencas(plano_id)")
      .gte("criado_em", inicio.toISOString())
      .lte("criado_em", fim.toISOString()),
  ]);

  const linhasHistorico = (historicoNoPeriodo.data ?? []) as any[];

  const emitidas = linhasHistorico.filter((l) => l.motivo === "EMISSAO");
  const canceladas = linhasHistorico.filter((l) => l.motivo === "CANCELAMENTO");

  // Receita gerada no período = soma do valor do plano de cada licença
  // EMITIDA no período (independente do status dela hoje).
  let receitaNoPeriodo = 0;

  if (emitidas.length > 0) {
    const planoIds = [
      ...new Set(
        emitidas
          .map((l) => l.licencas?.plano_id)
          .filter((id): id is string => !!id)
      ),
    ];

    if (planoIds.length > 0) {
      const { data: planosDoPeriodo } = await supabase
        .from("planos")
        .select("id, valor")
        .in("id", planoIds);

      const valorPorPlano = new Map(
        (planosDoPeriodo ?? []).map((p: any) => [p.id, Number(p.valor) || 0])
      );

      receitaNoPeriodo = emitidas.reduce((soma, l) => {
        const planoId = l.licencas?.plano_id;
        return soma + (planoId ? valorPorPlano.get(planoId) ?? 0 : 0);
      }, 0);
    }
  }

  return {
    inicio: inicio.toISOString().slice(0, 10),
    fim: fim.toISOString().slice(0, 10),
    novasEmpresas: empresasNoPeriodo.data?.length || 0,
    licencasEmitidas: emitidas.length,
    licencasCanceladas: canceladas.length,
    receitaGerada: receitaNoPeriodo,
  };
}
