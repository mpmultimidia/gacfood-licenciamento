import { Router } from "express";
import { envolverAsync } from "../middleware/tratarErros.ts";
import {
  autenticarCliente,
  autenticarAdmin,
} from "../middleware/autenticar.ts";

import {
  consultarEmpresa,
  listarEmpresas,
} from "../controles/empresasControle.ts";

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