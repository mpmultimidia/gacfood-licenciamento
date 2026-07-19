// api/controles/licencasControle
import type { Request, Response } from 'express';
import { supabase } from '../../supabase/conexao.js';
import { solicitarCodigoDeAtivacao, ativarOuRenovarLicenca } from '../../licenciamento/renovacao.js';
import { buscarLicencaAtivaDaEmpresa, licencaEstaValida } from '../../licenciamento/validacao.js';
import { registrarEventoSistema } from '../../servicos/logsSistema.js';

function gerarCodigoLicenca(): string {
  const aleatorio = Math.random().toString(36).slice(2, 8).toUpperCase();
  const data = Date.now().toString(36).toUpperCase();
  return `LIC-${data}-${aleatorio}`;
}

/**
 * GET /api/licencas   (chave admin)
 * Lista todas as licenças já emitidas, com nome da empresa e do plano.
 */
export async function listarLicencas(_req: Request, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from('licencas')
    .select('id, empresa_id, plano_id, codigo_licenca, versao, status, emitida_em, expira_em, empresas(nome_fantasia, codigo), planos(nome)')
    .order('emitida_em', { ascending: false });

  if (error) throw error;

  const resultado = (data ?? []).map((l: any) => ({
    id: l.id,
    empresaId: l.empresa_id,
    planoId: l.plano_id,
    empresa: l.empresas?.nome_fantasia ?? '-',
    empresaCodigo: l.empresas?.codigo ?? null,
    plano: l.planos?.nome ?? '-',
    codigo_licenca: l.codigo_licenca,
    versao: l.versao,
    status: l.status,
    emitida_em: l.emitida_em,
    expira_em: l.expira_em,
  }));

  res.json(resultado);
}

/**
 * POST /api/licencas   (chave admin)
 * Emite uma licença nova para uma empresa já cadastrada, em um plano
 * já cadastrado. O prazo de validade vem do plano (dias_validade_padrao),
 * a menos que "dias_validade" seja informado explicitamente no body.
 * Também grava um registro em historico_licencas.
 */
export async function criarLicenca(req: Request, res: Response): Promise<void> {
  const { empresa_id, plano_id, dias_validade } = req.body as {
    empresa_id?: string;
    plano_id?: string;
    dias_validade?: number;
  };

  if (!empresa_id || !plano_id) {
    res.status(400).json({ ok: false, erro: 'Informe a empresa e o plano.' });
    return;
  }

  const { data: plano, error: erroPlano } = await supabase
    .from('planos')
    .select('id, nome, dias_validade_padrao')
    .eq('id', plano_id)
    .single();

  if (erroPlano || !plano) {
    res.status(400).json({ ok: false, erro: 'Plano não encontrado.' });
    return;
  }

  const dias = dias_validade ?? (plano as any).dias_validade_padrao ?? 30;

  const agora = new Date();
  const expiraEm = new Date(agora.getTime() + dias * 24 * 60 * 60 * 1000);

  const codigoLicenca = gerarCodigoLicenca();

  const { data: licenca, error: erroLicenca } = await supabase
    .from('licencas')
    .insert({
      empresa_id,
      plano_id,
      codigo_licenca: codigoLicenca,
      emitida_em: agora.toISOString(),
      expira_em: expiraEm.toISOString(),
      status: 'ATIVA',
    } as any)
    .select()
    .single();

  if (erroLicenca) throw erroLicenca;

  await supabase
    .from('historico_licencas')
    .insert({
      licenca_id: (licenca as any).id,
      empresa_id,
      codigo_licenca: codigoLicenca,
      emitida_em: agora.toISOString(),
      expira_em: expiraEm.toISOString(),
      motivo: 'EMISSAO',
      emitida_por: (req as any).usuario?.login ?? null,
    } as any);

  await registrarEventoSistema(
    `Licença emitida (${codigoLicenca}) para empresa ${empresa_id}.`,
    'INFO',
    (req as any).usuario?.login
  );

  res.json({ ok: true, licenca });
}

/**
 * POST /api/licencas/solicitar-codigo   (chave admin)
 * body: { codigoEmpresa: string }
 * Passo 1 do robô: gera e retorna o código de ativação para enviar por WhatsApp.
 */
export async function solicitarCodigo(req: Request, res: Response): Promise<void> {
  const { codigoEmpresa } = req.body as { codigoEmpresa?: string };
  if (!codigoEmpresa) {
    res.status(400).json({ ok: false, erro: 'Informe o código da empresa.' });
    return;
  }

  const { empresa, codigoAtivacao } = await solicitarCodigoDeAtivacao(codigoEmpresa);
  res.json({
    ok: true,
    empresa: { codigo: (empresa as any).codigo, nome_fantasia: (empresa as any).nome_fantasia },
    codigoAtivacao: {
      codigo: (codigoAtivacao as any).codigo,
      expira_em: (codigoAtivacao as any).expira_em,
    },
  });
}

/**
 * POST /api/licencas/ativar   (chave cliente)
 * body: { codigoAtivacao: string, hashDispositivo?: string }
 * Passo 2 do robô: o GACFOOD local chama isso com o código digitado
 * pelo cliente. Retorna os dados que devem ser gravados no .env local —
 * incluindo as credenciais do Supabase deste restaurante e os módulos
 * liberados pelo plano contratado.
 */
export async function ativarLicenca(req: Request, res: Response): Promise<void> {
  const { codigoAtivacao, hashDispositivo } = req.body as {
    codigoAtivacao?: string;
    hashDispositivo?: string;
  };
  if (!codigoAtivacao) {
    res.status(400).json({ ok: false, erro: 'Informe o código de ativação.' });
    return;
  }

  const licenca = await ativarOuRenovarLicenca(codigoAtivacao, { hashDispositivo });
  res.json({
    ok: true,
    licenca: {
      codigo_licenca: licenca.codigo_licenca,
      versao: licenca.versao,
      emitida_em: licenca.emitida_em,
      expira_em: licenca.expira_em,
      status: licenca.status,
      modulos: licenca.modulos,
    },
    credenciais: licenca.credenciais,
  });
}

/**
 * GET /api/licencas/vencendo   (chave admin)
 * Usa a view lic.vw_licencas_vencendo (licenças ATIVA vencendo em até 5 dias).
 * Junta com empresas para trazer nome_fantasia e código, já que a view
 * só devolve colunas de lic.licencas.
 */
export async function listarVencendo(_req: Request, res: Response): Promise<void> {
  const { data: licencas, error } = await supabase
    .from('vw_licencas_vencendo')
    .select('*')
    .order('expira_em', { ascending: true });
  if (error) throw error;

  const empresaIds = [...new Set((licencas ?? []).map((l) => l.empresa_id))];
  let empresasPorId = new Map<string, { codigo: string; nome_fantasia: string }>();

  if (empresaIds.length > 0) {
    const { data: empresas, error: erroEmpresas } = await supabase
      .from('empresas')
      .select('id, codigo, nome_fantasia')
      .in('id', empresaIds);
    if (erroEmpresas) throw erroEmpresas;
    empresasPorId = new Map((empresas ?? []).map((e) => [e.id, { codigo: e.codigo, nome_fantasia: e.nome_fantasia }]));
  }

  const resultado = (licencas ?? []).map((l) => ({
    codigo_licenca: l.codigo_licenca,
    expira_em: l.expira_em,
    empresa: empresasPorId.get(l.empresa_id) ?? null,
  }));

  res.json({ ok: true, licencas: resultado });
}

/**
 * GET /api/licencas/historico   (chave admin)
 * query: ?limite=50 (opcional, padrão 50)
 * Lista o histórico de emissões/renovações mais recentes, com nome da empresa,
 * já no formato { acao, descricao, usuario, data } que a tela de Histórico usa.
 */
export async function listarHistorico(req: Request, res: Response): Promise<void> {
  const limite = Number(req.query.limite) || 50;

  const { data, error } = await supabase
    .from('historico_licencas')
    .select('*, empresas(codigo, nome_fantasia)')
    .order('criado_em', { ascending: false })
    .limit(limite);
  if (error) throw error;

  const resultado = (data ?? []).map((h: any) => ({
    id: h.id,
    acao: h.motivo === 'EMISSAO' ? 'Licença emitida' : (h.motivo ?? 'Evento de licença'),
    descricao: `${h.empresas?.nome_fantasia ?? 'Empresa'} — código ${h.codigo_licenca}, válida até ${new Date(h.expira_em).toLocaleDateString('pt-BR')}`,
    usuario: h.emitida_por ?? 'Sistema',
    data: new Date(h.criado_em).toLocaleString('pt-BR'),
  }));

  res.json(resultado);
}

/**
 * GET /api/licencas/:empresaId/status   (chave cliente)
 * Revalidação periódica: o GACFOOD pode chamar isso de tempos em tempos
 * para confirmar que a licença continua válida (ex: caso você precise
 * cancelar/suspender uma empresa no meio da vigência).
 */
export async function statusLicenca(req: Request, res: Response): Promise<void> {
  const { empresaId } = req.params as { empresaId: string };

  const licenca = await buscarLicencaAtivaDaEmpresa(empresaId);
  res.json({
    ok: true,
    valida: licencaEstaValida(licenca),
    licenca: licenca
      ? {
          codigo_licenca: licenca.codigo_licenca,
          expira_em: licenca.expira_em,
          status: licenca.status,
        }
      : null,
  });
}

/**
 * PUT /api/licencas/:id   (chave admin)
 * Altera plano, validade e/ou status de uma licença já emitida.
 */
export async function atualizarLicenca(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status, plano_id, expira_em } = req.body as {
    status?: string;
    plano_id?: string;
    expira_em?: string;
  };

  const campos: Record<string, any> = {};
  if (status !== undefined) campos.status = status;
  if (plano_id !== undefined) campos.plano_id = plano_id;
  if (expira_em !== undefined) campos.expira_em = expira_em;

  const { data, error } = await supabase
    .from('licencas')
    .update(campos as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({ ok: true, licenca: data });
}

/**
 * DELETE /api/licencas/:id   (chave admin)
 * Não apaga a linha do banco — marca a licença como CANCELADA
 * (o registro em historico_licencas continua intacto).
 */
export async function excluirLicenca(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const { error } = await supabase
    .from('licencas')
    .update({ status: 'CANCELADA' } as any)
    .eq('id', id);

  if (error) throw error;

  await registrarEventoSistema(
    `Licença cancelada (id ${id}).`,
    'AVISO',
    (req as any).usuario?.login
  );

  res.json({ ok: true });
}
