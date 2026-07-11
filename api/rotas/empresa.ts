import { Router } from "express";
import {
  listarEmpresas,
  buscarEmpresa,
  criarEmpresa
} from "../../servicos/empresa.ts";

const router = Router();

router.get("/", async (_req, res) => {
  const resultado = await listarEmpresas();

  res.json(resultado);
});

router.get("/:id", async (req, res) => {
  const resultado = await buscarEmpresa(
    req.params.id
  );

  res.json(resultado);
});

router.post("/", async (req, res) => {
  const resultado = await criarEmpresa(
    req.body
  );

  res.json(resultado);
});

export default router;