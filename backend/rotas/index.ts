import { Router } from "express";
import { autenticarAdmin, autenticarCliente } from "../middleware/autenticar.ts";

import authRota from "./auth.ts";
import sistemaRota from "./sistema.ts";
import empresasRota from "./empresas.ts";
import planosRota from "./planos.ts";
import assinaturasRota from "./assinaturas.ts";
import usuariosRota from "./usuarios.ts";
import permissoesRota from "./permissoes.ts";
import licencasRota from "./licencas.ts";
import modulosRota from "./modulos.ts";
import planosModulosRota from "./planosModulos.ts";
import empresasUsuariosRota from "./empresasUsuarios.ts";
import usuariosPermissoesRota from "./usuariosPermissoes.ts";
import validacaoRota from "./validacao.ts";
import ativacaoRota from "./ativacao.ts";
import codigoAtivacaoRota from "./codigoAtivacao.ts";
import renovacaoRota from "./renovacao.ts";
import dashboardRota from "./dashboard.ts";
import saudeRota from "./saude.ts";
import notificacaoRota from "./notificacao.ts";
import backupRota from "./backup.ts";
import configuracoesRota from "./configuracoes.ts";
import logsRota from "./logs.ts";
import credenciaisRota from "./credenciais.ts";

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

// /ativacao: mesmo caso do /validacao — o servidor do cliente chama isso
// sozinho (com ou sem humano por perto) na hora de ativar a licença pela
// primeira vez, recebendo de volta as credenciais do Supabase daquele
// restaurante. Mesma autenticação de "/validacao".
rotas.use("/ativacao", autenticarCliente, ativacaoRota);

// ─── A PARTIR DAQUI, TUDO EXIGE LOGIN DE ADMIN (JWT) ──────────────────────
rotas.use(autenticarAdmin);

rotas.use("/sistema", sistemaRota);
rotas.use("/empresas", empresasRota);
rotas.use("/planos", planosRota);
rotas.use("/assinaturas", assinaturasRota);
rotas.use("/usuarios", usuariosRota);
rotas.use("/permissoes", permissoesRota);
rotas.use("/licencas", licencasRota);
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

// /credenciais: fica AQUI de propósito (depois do rotas.use(autenticarAdmin)
// acima) — só um admin logado no painel pode gerar/reemitir as credenciais
// do Supabase de um restaurante, no caminho manual (cliente sem internet).
rotas.use("/credenciais", credenciaisRota);

// /codigo-ativacao: também exige admin — é você quem gera o código de 6
// dígitos pra uma empresa específica, na tela de Empresas/Licenças.
rotas.use("/codigo-ativacao", codigoAtivacaoRota);

export default rotas;
