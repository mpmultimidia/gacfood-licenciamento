import { Router } from "express";
import { validarLicencaEmpresa } from "../../servicos/validacaoLicenca.js";
 
const router = Router();
 
router.post("/", async (req, res) => {
  const { codigo } = req.body;
 
  const resultado = await validarLicencaEmpresa(codigo);
 
  res.json(resultado);
});
 
export default router;
