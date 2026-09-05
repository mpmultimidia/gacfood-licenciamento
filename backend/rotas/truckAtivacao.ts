// licenciamento/rotas/truckAtivacao.ts
//
// Ativação do GACFOOD TRUCK — troca o código de 6 dígitos (o mesmo
// mecanismo já usado pelo GACFOOD normal, gerado por
// gerarCodigoAtivacao()) pelas credenciais permanentes do
// estabelecimento.
//
// Reaproveita 100% da lógica já existente e testada em
// codigoAtivacao.ts (resgatarCodigoAtivacao) — este arquivo só expõe
// isso como rota pública e devolve, junto com o código permanente, os
// dados do estabelecimento (nome_fantasia, cnpj, id) já cadastrados
// pelo admin no painel de licenciamento. Assim o Truck não precisa
// pedir pro dono digitar de novo o nome do estabelecimento — só
// confirma o que já está cadastrado.
//
// Pré-requisito no painel administrativo (nenhuma mudança de código
// necessária lá, só uso): o admin já precisa ter criado a empresa +
// plano + licença + gerado o código de 6 dígitos, exatamente como já
// faz hoje para o GACFOOD normal.

import { Router } from "express";
import { supabase } from "../../supabase/conexao.js";
import { resgatarCodigoAtivacao } from "../../servicos/codigoAtivacao.js";

const router = Router();

router.post("/", async (req, res) => {
  const { codigo } = req.body;

  if (!codigo) {
    return res.status(400).json({ ok: false, error: "Código de ativação obrigatório." });
  }

  try {
    const codigoLicencaPermanente = await resgatarCodigoAtivacao(codigo);

    const { data: empresa, error: erroEmpresa } = await supabase
      .from("empresas")
      .select("id, nome_fantasia, cnpj, status")
      .eq("codigo", codigoLicencaPermanente)
      .single();

    if (erroEmpresa || !empresa) {
      return res.status(500).json({
        ok: false,
        error: "Ativação concluída, mas não foi possível carregar os dados do estabelecimento.",
      });
    }

    return res.json({
      ok: true,
      restaurante_id: (empresa as any).id,
      codigo_licenca: codigoLicencaPermanente,
      nome_fantasia: (empresa as any).nome_fantasia,
      cnpj: (empresa as any).cnpj || null,
    });
  } catch (erro: any) {
    return res.status(400).json({ ok: false, error: erro.message });
  }
});

export default router;
