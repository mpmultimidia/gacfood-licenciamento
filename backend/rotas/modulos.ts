import { Router } from "express";
import {
  listarModulos,
  buscarModulo,
  criarModulo
} from "../../servicos/modulo.ts";

const router = Router();

router.get("/", async (_req, res) => {
  const resultado = await listarModulos();

  res.json(resultado);
});

router.get("/:id", async (req, res) => {
  const resultado = await buscarModulo(
    req.params.id
  );

  res.json(resultado);
});

router.post("/", async (req, res) => {
  const resultado = await criarModulo(
    req.body
  );

  res.json(resultado);
});

export default router;