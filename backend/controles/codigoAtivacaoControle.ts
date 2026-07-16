// api/controles/codigoAtivacaoControle.ts
import type { Request, Response } from "express";
import { gerarCodigoAtivacao } from "../../licenciamento/codigoAtivacao.ts";

// Protegida pelo JWT de admin (montada depois de rotas.use(autenticarAdmin)
// em api/rotas/index.ts") — só você, logado no painel, gera códigos.
export async function gerarCodigo(
  req: Request,
  res: Response
): Promise<void> {
  const { empresa_id } = req.body as { empresa_id?: string };

  if (!empresa_id) {
    res.status(400).json({ ok: false, erro: "Informe a empresa." });
    return;
  }

  try {
    const resultado = await gerarCodigoAtivacao(empresa_id);
    res.json({ ok: true, ...resultado });
  } catch (e: any) {
    res.status(400).json({
      ok: false,
      erro: e.message || "Erro ao gerar código de ativação.",
    });
  }
}
