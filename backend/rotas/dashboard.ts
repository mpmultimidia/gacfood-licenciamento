import { Router } from "express";
import { resumoSistema } from "../../servicos/dashboard.js";
import { exigirAdministrador } from "../middleware/autenticar.js";

const router = Router();

// exigirAdministrador: o Dashboard mostra receita e dados financeiros do
// negócio — usuários secundários (tela de Usuários) não têm acesso, só
// o MASTER/administrador. (autenticarAdmin já rodou antes, no index.ts,
// então req.usuario já está preenchido aqui.)
router.get("/", exigirAdministrador, async (req, res) => {
  const { inicio, fim } = req.query as { inicio?: string; fim?: string };

  const resultado = await resumoSistema({ inicio, fim });

  res.json({
    sucesso: true,
    dados: resultado
  });
});

export default router;
