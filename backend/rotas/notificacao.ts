import { Router } from "express";
import { enviarNotificacao } from "../../servicos/notificacao.js";

const router = Router();

router.post("/", async (req, res) => {
  const resultado = enviarNotificacao(
    req.body.destino,
    req.body.mensagem
  );

  res.json({
    sucesso: true,
    dados: resultado
  });
});

export default router;