import { Router } from "express";
import { validarLicencaEmpresa } from "../../servicos/validacaoLicenca.js";


const router = Router();



export async function buscarLicencaAtivaDaEmpresa(
  empresaId: string
) {

  return {
    empresaId,
    ativa: true
  };

}



export function licencaEstaValida(
  licenca: any
): boolean {

  if (!licenca) {
    return false;
  }

  return licenca.ativa === true;

}



router.post("/", async (req, res) => {

  const { codigo } = req.body;


  const resultado =
    await validarLicencaEmpresa(codigo);


  res.json(resultado);

});



export default router;