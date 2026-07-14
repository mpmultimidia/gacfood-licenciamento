import { Router } from "express";
import {
  verificarSaudeBanco,
  verificarSaudeLicenciamento,
} from "../../servicos/saudeSistema.js";

const router = Router();

router.get("/", async (_req, res) => {
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
    banco: banco.ok,
    licenciamento: licenciamento.ok,
    erroBanco: banco.erro ?? null,
    erroLicenciamento: licenciamento.erro ?? null,
  });
});

export default router;