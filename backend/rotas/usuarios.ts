import { Router } from "express";
import { envolverAsync } from "../middleware/tratarErros.js";
import { autenticarAdmin } from "../middleware/autenticar.js";
import {
  listarUsuarios,
  buscarUsuario,
  criarUsuario,
} from "../../servicos/usuario.js";

const router = Router();

router.get(
  "/",
  autenticarAdmin,
  envolverAsync(async (_req, res) => {
    const resultado = await listarUsuarios();

    res.json({
      ok: true,
      usuarios: resultado,
    });
  })
);

router.get(
  "/:id",
  autenticarAdmin,
  envolverAsync(async (req, res) => {
    const resultado = await buscarUsuario(
      req.params.id
    );

    res.json({
      ok: true,
      usuario: resultado,
    });
  })
);

router.post(
  "/",
  autenticarAdmin,
  envolverAsync(async (req, res) => {
    const resultado = await criarUsuario(
      req.body
    );

    res.json({
      ok: true,
      usuario: resultado,
    });
  })
);

export default router;