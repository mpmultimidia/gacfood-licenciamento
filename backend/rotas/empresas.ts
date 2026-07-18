import { Router } from "express";
import { envolverAsync } from "../middleware/tratarErros.js";
import {
  autenticarCliente,
  autenticarAdmin,
} from "../middleware/autenticar.js";

import {
  consultarEmpresa,
  listarEmpresas,
  criarEmpresa,
  atualizarEmpresa,
  excluirEmpresa,
} from "../controles/empresasControle.js";

const router = Router();

router.post(
  "/consultar",
  autenticarCliente,
  envolverAsync(consultarEmpresa)
);

router.get(
  "/",
  autenticarAdmin,
  envolverAsync(listarEmpresas)
);

router.post(
  "/",
  autenticarAdmin,
  envolverAsync(criarEmpresa)
);

router.put(
  "/:id",
  autenticarAdmin,
  envolverAsync(atualizarEmpresa)
);

router.delete(
  "/:id",
  autenticarAdmin,
  envolverAsync(excluirEmpresa)
);

export default router;