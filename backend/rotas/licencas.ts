// api/rotas/licencas.ts

import { Router } from "express";
import { envolverAsync } from "../middleware/tratarErros.js";

import {
  autenticarCliente,
  autenticarAdmin
} from "../middleware/autenticar.js";

import {
  solicitarCodigo,
  ativarLicenca,
  statusLicenca,
  listarVencendo,
  listarHistorico,
  listarLicencas,
  criarLicenca,
  criarLicencaTruck,
  atualizarLicenca,
  excluirLicenca,
} from "../controles/licencasControle.js";


export const licencasRotas = Router();


// chamado pelo painel administrativo — listar / emitir licenças
licencasRotas.get(
  "/",
  autenticarAdmin,
  envolverAsync(listarLicencas)
);


licencasRotas.post(
  "/",
  autenticarAdmin,
  envolverAsync(criarLicenca)
);


// chamado pelo painel administrativo — emissão automática de licença
// GACFOOD TRUCK (código de 6 dígitos, plano fixo, sem passar pelo Supabase
// manualmente). Fica antes de "/:id" de propósito — como "/truck" não é um
// formato de id, não colidiria mesmo, mas deixar entre as rotas de listar/
// criar licença comum deixa mais fácil de achar no arquivo.
licencasRotas.post(
  "/truck",
  autenticarAdmin,
  envolverAsync(criarLicencaTruck)
);


licencasRotas.put(
  "/:id",
  autenticarAdmin,
  envolverAsync(atualizarLicenca)
);


licencasRotas.delete(
  "/:id",
  autenticarAdmin,
  envolverAsync(excluirLicenca)
);


// chamado pelo robô/backoffice (chave admin)
// gera código de ativação
licencasRotas.post(
  "/solicitar-codigo",
  autenticarAdmin,
  envolverAsync(solicitarCodigo)
);


// chamado pelo painel administrativo
licencasRotas.get(
  "/vencendo",
  autenticarAdmin,
  envolverAsync(listarVencendo)
);


licencasRotas.get(
  "/historico",
  autenticarAdmin,
  envolverAsync(listarHistorico)
);


// chamado pelo GACFOOD instalado no cliente
licencasRotas.post(
  "/ativar",
  autenticarCliente,
  envolverAsync(ativarLicenca)
);


licencasRotas.get(
  "/:empresaId/status",
  autenticarCliente,
  envolverAsync(statusLicenca)
);


// compatibilidade com api/rotas/index.ts
export default licencasRotas;
