import { Router } from "express";
import { registrarBackup } from "../../servicos/backup.js";

const router = Router();

router.post("/", async (req, res) => {
  const resultado = registrarBackup(
    req.body.tipo || "manual"
  );

  res.json({
    sucesso: true,
    dados: resultado
  });
});

export default router;