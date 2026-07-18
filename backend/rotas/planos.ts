import { Router } from "express";
import {
  listarPlanos,
  buscarPlano,
  criarPlano,
  atualizarPlano,
  excluirPlano
} from "../../servicos/plano.js";
import { autenticarAdmin } from "../middleware/autenticar.js";

const router = Router();

router.get("/", autenticarAdmin, async (_req, res) => {
  const resultado = await listarPlanos();

  res.json(resultado);
});

router.get("/:id", autenticarAdmin, async (req, res) => {
  const resultado = await buscarPlano(
    req.params.id
  );

  res.json(resultado);
});

router.post("/", autenticarAdmin, async (req, res) => {
  const resultado = await criarPlano(
    req.body
  );

  res.json(resultado);
});

router.put("/:id", autenticarAdmin, async (req, res) => {
  const resultado = await atualizarPlano(
    req.params.id,
    req.body
  );

  res.json({ ok: true, plano: resultado });
});

router.delete("/:id", autenticarAdmin, async (req, res) => {
  await excluirPlano(
    req.params.id
  );

  res.json({ ok: true });
});

export default router;