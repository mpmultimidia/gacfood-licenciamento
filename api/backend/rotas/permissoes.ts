// api/rotas/permissoes.ts

import { Router } from "express";
import { envolverAsync } from "../middleware/tratarErros.ts";
import { autenticarAdmin } from "../middleware/autenticar.ts";

import {
  listarFuncionalidadesDaEmpresa,
  empresaTemFuncionalidade
} from "../../licenciamento/permissoes.ts";


const permissoesRotas = Router();



permissoesRotas.get(
  "/empresa/:empresaId",
  autenticarAdmin,
  envolverAsync(async (req, res) => {

    const resultado =
      await listarFuncionalidadesDaEmpresa(
        req.params.empresaId
      );

    res.json(resultado);

  })
);



permissoesRotas.get(
  "/empresa/:empresaId/:codigo",
  autenticarAdmin,
  envolverAsync(async (req, res) => {

    const resultado =
      await empresaTemFuncionalidade(
        req.params.empresaId,
        req.params.codigo
      );

    res.json({
      permitido: resultado
    });

  })
);



export default permissoesRotas;