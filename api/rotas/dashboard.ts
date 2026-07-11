import { Router } from "express";
import { resumoSistema } from "../../servicos/dashboard.ts";

const router = Router();

router.get("/", async (_req, res) => {
  const resultado = await resumoSistema();

  res.json({
    sucesso: true,
    dados: resultado
  });
});

export default router;