import { Router } from "express";
import { resumoSistema } from "../../servicos/dashboard.js";

const router = Router();

router.get("/", async (req, res) => {
  const { inicio, fim } = req.query as { inicio?: string; fim?: string };

  const resultado = await resumoSistema({ inicio, fim });

  res.json({
    sucesso: true,
    dados: resultado
  });
});

export default router;
