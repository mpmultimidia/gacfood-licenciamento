import { Router } from "express";
import {
  salvarConfiguracao,
  buscarConfiguracao,
  listarConfiguracoes
} from "../../servicos/configuracao.js";

const router = Router();

router.get("/", async (_req, res) => {
  const resultado = await listarConfiguracoes();

  res.json(resultado);
});

router.get("/:chave", async (req, res) => {
  const resultado = await buscarConfiguracao(
    req.params.chave
  );

  res.json(resultado);
});

router.post("/", async (req, res) => {
  const resultado = await salvarConfiguracao(
    req.body.chave,
    req.body.valor
  );

  res.json(resultado);
});

export default router;