import { Router } from "express";
import jwt from "jsonwebtoken";
import { envolverAsync } from "../middleware/tratarErros.js";
import { autenticarUsuario } from "../../servicos/usuario.js";
import { ambiente } from "../../config/ambiente.js";

const router = Router();

// Rota pública (não passa por autenticarAdmin) — é aqui que se consegue o
// token pela primeira vez, então não dá pra exigir token pra acessar ela.
router.post(
  "/login",
  envolverAsync(async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({
        ok: false,
        erro: "Informe e-mail e senha.",
      });
      return;
    }

    const usuario = await autenticarUsuario(email, senha);

    if (!usuario) {
      res.status(401).json({
        ok: false,
        erro: "E-mail ou senha inválidos.",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        perfil: usuario.perfil,
      },
      ambiente.apiKeyAdmin,
      { expiresIn: "8h" }
    );

    res.json({
      ok: true,
      token,
      usuario,
    });
  })
);

export default router;
