import { Router } from "express";
import {
  listarUsuariosPermissoes,
  buscarUsuarioPermissao,
  criarUsuarioPermissao
} from "../../servicos/usuarioPermissao.js";

const router = Router();

router.get("/", async (_req, res) => {
  const resultado = await listarUsuariosPermissoes();

  res.json(resultado);
});

router.get("/:id", async (req, res) => {
  const resultado = await buscarUsuarioPermissao(
    req.params.id
  );

  res.json(resultado);
});

router.post("/", async (req, res) => {
  const resultado = await criarUsuarioPermissao(
    req.body
  );

  res.json(resultado);
});

export default router;