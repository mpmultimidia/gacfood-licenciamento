import { Router } from "express";
import { ativarPorCodigoDeLicenca } from "../../servicos/ativacaoAutomatica.js";
import { envolverAsync } from "../middleware/tratarErros.js";

const router = Router();

// POST /api/ativacao   (chave cliente — x-api-key)
// Chamado pelo servidor GACFOOD instalado (ativarLicencaSeNecessario),
// uma única vez, com o código PERMANENTE da licença (não o código de
// 6 dígitos). Devolve as credenciais do Supabase para essa instalação.
router.post(
  "/",
  envolverAsync(async (req, res) => {
    const { codigo } = req.body as { codigo?: string };

    if (!codigo) {
      res.status(400).json({ ok: false, erro: "Informe o código da licença." });
      return;
    }

    const credenciais = await ativarPorCodigoDeLicenca(codigo);

    res.json({ ok: true, credenciais });
  })
);

export default router;
