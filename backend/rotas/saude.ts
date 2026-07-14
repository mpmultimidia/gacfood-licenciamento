import { Router } from "express";
import {
  verificarSaudeBanco,
  verificarSaudeLicenciamento,
} from "../../servicos/saudeSistema.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [banco, licenciamento] = await Promise.all([
      verificarSaudeBanco(),
      verificarSaudeLicenciamento(),
    ]);

    res.status(200).json({
      ok: true,
      sistema: "GACFOOD LICENCIAMENTO",
      status: "online",
      ambiente: process.env.NODE_ENV ?? "development",
      api: true,
      banco,
      licenciamento,
    });
  } catch (erro) {
    res.status(500).json({
      ok: false,
      sistema: "GACFOOD LICENCIAMENTO",
      status: "erro",
      api: false,
      banco: false,
      licenciamento: false,
      erro: erro instanceof Error ? erro.message : "Erro desconhecido",
    });
  }
});

export default router;