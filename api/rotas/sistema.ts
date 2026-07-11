import { Router } from "express";

const router = Router();

router.get("/status", async (_req, res) => {
  res.json({
    sistema: "GACFOOD LICENCIAMENTO",
    status: "online"
  });
});

export default router;