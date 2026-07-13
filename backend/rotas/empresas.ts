import { Router } from "express";
import { envolverAsync } from "../middleware/tratarErros.js";
import {
  autenticarCliente,
  autenticarAdmin,
} from "../middleware/autenticar.js";

import {
  consultarEmpresa,
  listarEmpresas,
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

export default router;