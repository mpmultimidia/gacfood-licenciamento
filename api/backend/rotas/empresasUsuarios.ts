import { Router } from "express";
import {
  listarEmpresasUsuarios,
  buscarEmpresaUsuario,
  criarEmpresaUsuario
} from "../../servicos/empresaUsuario.ts";

const router = Router();

router.get("/", async (_req, res) => {
  const resultado = await listarEmpresasUsuarios();

  res.json(resultado);
});

router.get("/:id", async (req, res) => {
  const resultado = await buscarEmpresaUsuario(
    req.params.id
  );

  res.json(resultado);
});

router.post("/", async (req, res) => {
  const resultado = await criarEmpresaUsuario(
    req.body
  );

  res.json(resultado);
});

export default router;