import { Router } from "express";
import {
  listarPlanos,
  buscarPlano,
  criarPlano
} from "../../servicos/plano.ts";

const router = Router();

router.get("/", async (_req, res) => {
  const resultado = await listarPlanos();

  res.json(resultado);
});

router.get("/:id", async (req, res) => {
  const resultado = await buscarPlano(
    req.params.id
  );

  res.json(resultado);
});

router.post("/", async (req, res) => {
  const resultado = await criarPlano(
    req.body
  );

  res.json(resultado);
});

export default router;