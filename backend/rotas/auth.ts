import { Router } from "express";
import jwt from "jsonwebtoken";
import { envolverAsync } from "../middleware/tratarErros.js";
import { autenticarAdministrador } from "../../servicos/administrador.js";
import { autenticarUsuario } from "../../servicos/usuario.js";
import { ambiente } from "../../config/ambiente.js";
import { registrarEventoSistema } from "../../servicos/logsSistema.js";

const router = Router();

// Rota pública (não passa por autenticarAdmin) — é aqui que se consegue o
// token pela primeira vez, então não dá pra exigir token pra acessar ela.
//
// Login por usuário e senha (NUNCA e-mail) — mesmo padrão usado em todo o
// resto do sistema GACFOOD.
//
// Primeiro tenta como administrador (MASTER, tabela administradores).
// Se não bater, tenta como usuário secundário (tabela usuarios", cadastrado
// na tela de Usuários) — esse tipo tem acesso restrito (ex.: sem Dashboard).
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

    if (administrador) {
      const token = jwt.sign(
        {
          id: administrador.id,
          login: administrador.login,
          perfil: administrador.perfil,
          tipo: "administrador",
        },
        ambiente.apiKeyAdmin,
        { expiresIn: "8h" }
      );

      await registrarEventoSistema(
        `Login realizado (administrador).`,
        "INFO",
        administrador.login
      );

      res.json({
        ok: true,
        token,
        usuario: { ...administrador, tipo: "administrador" },
      });
      return;
    }

    const usuarioSecundario = await autenticarUsuario(login, senha);

    if (usuarioSecundario) {
      const token = jwt.sign(
        {
          id: (usuarioSecundario as any).id,
          login: (usuarioSecundario as any).login,
          perfil: (usuarioSecundario as any).perfil,
          tipo: "usuario",
        },
        ambiente.apiKeyAdmin,
        { expiresIn: "8h" }
      );

      await registrarEventoSistema(
        `Login realizado (usuário).`,
        "INFO",
        (usuarioSecundario as any).login
      );

      res.json({
        ok: true,
        token,
        usuario: { ...usuarioSecundario, tipo: "usuario" },
      });
      return;
    }

    await registrarEventoSistema(
      `Tentativa de login falhou para "${login}".`,
      "AVISO",
      login
    );

    res.status(401).json({
      ok: false,
      erro: "Login ou senha inválidos.",
    });
  })
);

export default router;