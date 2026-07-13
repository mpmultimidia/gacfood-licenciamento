import { Router } from "express";
import {
  registrarEventoSistema,
  listarLogsSistema
} from "../../servicos/logsSistema.js";

const router = Router();

router.get("/", async (_req, res) => {
  const resultado = await listarLogsSistema();

  res.json(resultado);
});

router.post("/", async (req, res) => {
  const resultado =
    await registrarEventoSistema(
      req.body.evento,
      req.body.detalhes
    );

  res.json(resultado);
});

export default router;