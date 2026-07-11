// api/controles/licencasControle
import type { Request, Response } from 'express';
import { supabase } from '../../supabase/conexao.ts';
import { solicitarCodigoDeAtivacao, ativarOuRenovarLicenca } from '../../licenciamento/renovacao.ts';
import { buscarLicencaAtivaDaEmpresa, licencaEstaValida } from '../../licenciamento/validacao.ts';

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
    empresa: { codigo: empresa.codigo, nome_fantasia: empresa.nome_fantasia },
    codigoAtivacao: {
      codigo: codigoAtivacao.codigo,
      expira_em: codigoAtivacao.expira_em,
    },
  });
}

/**
 * POST /api/licencas/ativar   (chave cliente)
 * body: { codigoAtivacao: string, hashDispositivo?: string }
 * Passo 2 do robô: o GACFOOD local chama isso com o código digitado
 * pelo cliente. Retorna os dados que devem ser gravados no SQLite local.
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
    },
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
 * Lista o histórico de emissões/renovações mais recentes, com nome da empresa.
 */
export async function listarHistorico(req: Request, res: Response): Promise<void> {
  const limite = Number(req.query.limite) || 50;

  const { data, error } = await supabase
    .from('historico_licencas')
    .select('*, empresas(codigo, nome_fantasia)')
    .order('emitida_em', { ascending: false })
    .limit(limite);
  if (error) throw error;

  res.json({ ok: true, historico: data ?? [] });
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
