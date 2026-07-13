import { Router } from "express";
import {
  listarPlanosModulos,
  buscarPlanoModulo,
  criarPlanoModulo
} from "../../servicos/planoModulo.js";

const router = Router();

router.get("/", async (_req, res) => {
  const resultado = await listarPlanosModulos();

  res.json(resultado);
});

router.get("/:id", async (req, res) => {
  const resultado = await buscarPlanoModulo(
    req.params.id
  );

  res.json(resultado);
});

router.post("/", async (req, res) => {
  const resultado = await criarPlanoModulo(
    req.body
  );

  res.json(resultado);
});

export default router;