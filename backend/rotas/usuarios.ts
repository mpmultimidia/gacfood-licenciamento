import { Router } from "express";
import { envolverAsync } from "../middleware/tratarErros.js";
import { autenticarAdmin } from "../middleware/autenticar.js";
import {
  listarUsuarios,
  buscarUsuario,
  criarUsuario,
  atualizarUsuario,
  excluirUsuario,
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

router.put(
  "/:id",
  autenticarAdmin,
  envolverAsync(async (req, res) => {
    const resultado = await atualizarUsuario(
      req.params.id,
      req.body
    );

    res.json({
      ok: true,
      usuario: resultado,
    });
  })
);

router.delete(
  "/:id",
  autenticarAdmin,
  envolverAsync(async (req, res) => {
    await excluirUsuario(
      req.params.id
    );

    res.json({ ok: true });
  })
);

export default router;