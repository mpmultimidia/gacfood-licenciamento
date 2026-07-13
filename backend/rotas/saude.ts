import { Router } from "express";
import { verificarSaudeBanco } from "../../servicos/saudeSistema.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const resultado = await verificarSaudeBanco();

    res.status(200).json({
      ok: true,
      sistema: "GACFOOD LICENCIAMENTO",
      status: "online",
      ambiente: process.env.NODE_ENV ?? "development",
      ...resultado,
    });
  } catch (erro) {
    res.status(500).json({
      ok: false,
      sistema: "GACFOOD LICENCIAMENTO",
      status: "erro",
      erro:
        erro instanceof Error
          ? erro.message
          : "Erro desconhecido",
    });
  }
});

export default router;