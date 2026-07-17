// api/controles/ativacaoControle.ts
import type { Request, Response } from "express";
import { buscarEmpresaPorCodigo, buscarLicencaAtivaDaEmpresa, licencaEstaValida } from "../../licenciamento/validacao.ts";
import { resgatarCodigoAtivacao } from "../../licenciamento/codigoAtivacao.ts";
import { garantirCredenciaisRestaurante } from "../../supabase/authRestaurante.ts";
import { listarFuncionalidadesDoPlano } from "../../servicos/funcionalidadesPlano.ts";

// ─────────────────────────────────────────────────────────────────────────
// CAMINHO AUTOMÁTICO (com internet)
// Aceita DOIS jeitos de identificar a empresa:
//   - "codigo_ativacao": código de 6 dígitos, de uso único, gerado por você
//     no painel — é o normal na primeira ativação de um cliente novo.
//   - "codigo": o código de licença permanente da empresa — usado em
//     reativações (ex: reinstalação do mesmo cliente que já tem o código).
//
// Em ambos os casos, devolvemos o código de licença permanente (pra o
// GACFOOD gravar e usar depois em /api/validacao") + as credenciais do
// Supabase deste restaurante.
//
// Autenticação: feita pelo middleware autenticarCliente" (x-api-key),
// já aplicado na montagem da rota em api/rotas/index.ts". Não repetir a
// checagem aqui.
// ─────────────────────────────────────────────────────────────────────────
export async function ativarLicenca(
  req: Request,
  res: Response
): Promise<void> {
  const { codigo, codigo_ativacao } = req.body as {
    codigo?: string;
    codigo_ativacao?: string;
  };

  let codigoEmpresa = codigo;

  try {
    if (!codigoEmpresa && codigo_ativacao) {
      codigoEmpresa = await resgatarCodigoAtivacao(codigo_ativacao);
    }

    if (!codigoEmpresa) {
      res.status(400).json({
        ok: false,
        erro: "Informe o código de licença ou o código de ativação.",
      });
      return;
    }

    const empresa = await buscarEmpresaPorCodigo(codigoEmpresa);

    const licenca = await buscarLicencaAtivaDaEmpresa(empresa.id ?? (empresa as any).id);

    if (!licencaEstaValida(licenca)) {
      res.status(403).json({ ok: false, erro: "Licença inativa ou vencida." });
      return;
    }

    const credenciais = await garantirCredenciaisRestaurante({
      nomeEmpresa: empresa.nome_fantasia,
      codigoLicenca: codigoEmpresa,
      gerarNovaSenha: true,
    });

    const modulos = await listarFuncionalidadesDoPlano((licenca as any).plano_id);

    res.json({
      ok: true,
      codigo_licenca: codigoEmpresa,
      modulos,
      credenciais,
    });
  } catch (e: any) {
    res.status(400).json({
      ok: false,
      erro: e.message || "Erro ao ativar licença.",
    });
  }
}
