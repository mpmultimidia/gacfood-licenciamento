import { Router } from "express";
import {
  listarAssinaturas,
  buscarAssinatura,
  criarAssinatura
} from "../../servicos/assinatura.ts";

const router = Router();

router.get("/", async (_req, res) => {
  const resultado = await listarAssinaturas();

  res.json(resultado);
});

router.get("/:id", async (req, res) => {
  const resultado = await buscarAssinatura(
    req.params.id
  );

  res.json(resultado);
});

router.post("/", async (req, res) => {
  const resultado = await criarAssinatura(
    req.body
  );

  res.json(resultado);
});

export default router;