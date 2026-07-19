import { Router } from "express";
import {
  listarModulos,
  buscarModulo,
  criarModulo,
  atualizarModulo,
  excluirModulo
} from "../../servicos/modulo.js";
import { autenticarAdmin } from "../middleware/autenticar.js";

const router = Router();

router.get("/", autenticarAdmin, async (_req, res) => {
  const resultado = await listarModulos();

  res.json(resultado);
});

router.get("/:id", autenticarAdmin, async (req, res) => {
  const resultado = await buscarModulo(
    req.params.id
  );

  res.json(resultado);
});

router.post("/", autenticarAdmin, async (req, res) => {
  const resultado = await criarModulo(
    req.body
  );

  res.json(resultado);
});

router.put("/:id", autenticarAdmin, async (req, res) => {
  const resultado = await atualizarModulo(
    req.params.id,
    req.body
  );

  res.json(resultado);
});

router.delete("/:id", autenticarAdmin, async (req, res) => {
  const resultado = await excluirModulo(
    req.params.id
  );

  res.json(resultado);
});

export default router;
