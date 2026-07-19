import { Router } from "express";
import {
  registrarEventoSistema,
  listarLogsSistema
} from "../../servicos/logsSistema.js";
import { autenticarAdmin } from "../middleware/autenticar.js";

const router = Router();

router.get("/", autenticarAdmin, async (_req, res) => {
  const resultado = await listarLogsSistema();

  res.json(resultado);
});

router.post("/", autenticarAdmin, async (req, res) => {
  await registrarEventoSistema(
    req.body.mensagem,
    req.body.tipo,
    (req as any).usuario?.login
  );

  res.json({ ok: true });
});

export default router;
