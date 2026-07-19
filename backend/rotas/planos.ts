import { Router } from "express";
import {
  listarPlanos,
  buscarPlano,
  criarPlano,
  atualizarPlano,
  excluirPlano,
  listarFuncionalidadesDoPlano,
  definirFuncionalidadesDoPlano
} from "../../servicos/plano.js";
import { autenticarAdmin } from "../middleware/autenticar.js";

const router = Router();

router.get("/", autenticarAdmin, async (_req, res) => {
  const resultado = await listarPlanos();

  res.json(resultado);
});

router.get("/:id", autenticarAdmin, async (req, res) => {
  const plano = await buscarPlano(
    req.params.id
  );

  const funcionalidades = await listarFuncionalidadesDoPlano(
    req.params.id
  );

  res.json({ ...plano, funcionalidades });
});

router.post("/", autenticarAdmin, async (req, res) => {
  const { funcionalidades, ...dadosPlano } = req.body;

  const resultado = await criarPlano(
    dadosPlano
  );

  if (Array.isArray(funcionalidades) && resultado?.id) {
    await definirFuncionalidadesDoPlano(
      resultado.id,
      funcionalidades
    );
  }

  res.json({ ok: true, plano: resultado });
});

router.put("/:id", autenticarAdmin, async (req, res) => {
  const { funcionalidades, ...dadosPlano } = req.body;

  const resultado = await atualizarPlano(
    req.params.id,
    dadosPlano
  );

  if (Array.isArray(funcionalidades)) {
    await definirFuncionalidadesDoPlano(
      req.params.id,
      funcionalidades
    );
  }

  res.json({ ok: true, plano: resultado });
});

router.delete("/:id", autenticarAdmin, async (req, res) => {
  await excluirPlano(
    req.params.id
  );

  res.json({ ok: true });
});

export default router;
