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