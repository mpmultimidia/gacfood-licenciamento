import { Router } from "express";
import { autenticarAdmin, autenticarCliente } from "../middleware/autenticar.js";

import authRota from "./auth.js";
import sistemaRota from "./sistema.js";
import empresasRota from "./empresas.js";
import planosRota from "./planos.js";
import assinaturasRota from "./assinaturas.js";
import usuariosRota from "./usuarios.js";
import permissoesRota from "./permissoes.js";
import licencasRota from "./licencas.js";
import modulosRota from "./modulos.js";
import planosModulosRota from "./planosModulos.js";
import empresasUsuariosRota from "./empresasUsuarios.js";
import usuariosPermissoesRota from "./usuariosPermissoes.js";
import validacaoRota from "./validacao.js";
import renovacaoRota from "./renovacao.js";
import dashboardRota from "./dashboard.js";
import saudeRota from "./saude.js";
import notificacaoRota from "./notificacao.js";
import backupRota from "./backup.js";
import configuracoesRota from "./configuracoes.js";
import logsRota from "./logs.js";

export const rotas = Router();

// ─── ROTAS PÚBLICAS (sem exigir login de admin) ──────────────────────────
// /auth/login: é aqui que se consegue o token pela primeira vez — não dá
// pra exigir token pra acessar a própria rota de login.
rotas.use("/auth", authRota);

// /saude: healthcheck público (não expõe dado sensível nenhum, só status).
rotas.use("/saude", saudeRota);

// /validacao: quem chama isso é o SERVIDOR do restaurante sozinho (sem
// humano logado no painel) — por isso usa autenticarCliente (checa o
// header x-api-key contra API_KEY_CLIENTE), não o JWT de admin.
rotas.use("/validacao", autenticarCliente, validacaoRota);

// /licencas: fica ANTES do bloqueio geral de admin de propósito — o
// próprio arquivo licencas.ts" já define, rota por rota, quem precisa de
// quê (autenticarAdmin para solicitar-codigo/vencendo/historico,
// autenticarCliente para /ativar e /:empresaId/status, já que essas duas
// são chamadas pelo servidor do restaurante, sem admin logado). Se esse
// router ficasse depois do bloqueio geral, /licencas/ativar nunca seria
// alcançável pelo GACFOOD instalado no cliente.
rotas.use("/licencas", licencasRota);

// ─── A PARTIR DAQUI, TUDO EXIGE LOGIN DE ADMIN (JWT) ──────────────────────
rotas.use(autenticarAdmin);

rotas.use("/sistema", sistemaRota);
rotas.use("/empresas", empresasRota);
rotas.use("/planos", planosRota);
rotas.use("/assinaturas", assinaturasRota);
rotas.use("/usuarios", usuariosRota);
rotas.use("/permissoes", permissoesRota);

rotas.use("/modulos", modulosRota);
rotas.use("/planos-modulos", planosModulosRota);
rotas.use("/empresas-usuarios", empresasUsuariosRota);
rotas.use("/usuarios-permissoes", usuariosPermissoesRota);
rotas.use("/renovacao", renovacaoRota);
rotas.use("/dashboard", dashboardRota);
rotas.use("/notificacao", notificacaoRota);
rotas.use("/backup", backupRota);
rotas.use("/configuracoes", configuracoesRota);
rotas.use("/logs", logsRota);

export default rotas;
