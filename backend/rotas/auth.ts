import { Router } from "express";
import jwt from "jsonwebtoken";
import { envolverAsync } from "../middleware/tratarErros.js";
import { autenticarAdministrador } from "../../servicos/administrador.js";
import { ambiente } from "../../config/ambiente.js";

const router = Router();

// Rota pública (não passa por autenticarAdmin) — é aqui que se consegue o
// token pela primeira vez, então não dá pra exigir token pra acessar ela.
//
// Login por usuário e senha (NUNCA e-mail) — mesmo padrão usado em todo o
// resto do sistema GACFOOD.
router.post(
  "/login",
  envolverAsync(async (req, res) => {
    const { login, senha } = req.body;

    if (!login || !senha) {
      res.status(400).json({
        ok: false,
        erro: "Informe login e senha.",
      });
      return;
    }

    const administrador = await autenticarAdministrador(login, senha);

    if (!administrador) {
      res.status(401).json({
        ok: false,
        erro: "Login ou senha inválidos.",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: administrador.id,
        login: administrador.login,
        perfil: administrador.perfil,
      },
      ambiente.apiKeyAdmin,
      { expiresIn: "8h" }
    );

    res.json({
      ok: true,
      token,
      usuario: administrador,
    });
  })
);

export default router;
