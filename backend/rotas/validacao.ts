import { Router } from "express";
import { validarLicencaEmpresa } from "../../servicos/validacaoLicenca.js";

const router = Router();

router.post("/", async (req, res) => {
  const { codigo, hashDispositivo } = req.body ?? {};

  if (!codigo || typeof codigo !== "string") {
    res.status(400).json({
      data: null,
      error: { message: "Código da licença não informado." },
    });
    return;
  }

  try {
    const resultado = await validarLicencaEmpresa(
      codigo,
      typeof hashDispositivo === "string" ? hashDispositivo : undefined
    );

    res.json(resultado);
  } catch (erro: any) {
    // Falha de banco/rede: responde 500 (o app mantém o último resultado
    // em vez de tratar como licença cancelada).
    console.error("[validacao] erro inesperado:", erro);
    res.status(500).json({
      data: null,
      error: { message: "Erro interno do servidor." },
    });
  }
});

export default router;
