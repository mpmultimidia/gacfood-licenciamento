import { Router } from "express";
import { renovarLicenca } from "../../servicos/renovacaoLicenca.js";

const router = Router();

router.put("/:id", async (req, res) => {
  const resultado = await renovarLicenca(
    req.params.id,
    req.body.novaData
  );

  res.json(resultado);
});

export default router;