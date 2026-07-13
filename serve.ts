import express from "express";
import cors from "cors";
import { ambiente } from "./config/ambiente.js";
import { rotas } from "./backend/rotas/index.js";
import { tratarErros } from "./backend/middleware/tratarErros.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ambiente.painelUrl
      ? ambiente.painelUrl
      : "*",
    credentials: true,
  })
);

app.get("/", (_req, res) => {
  res.json({
    sistema: "GACFOOD Licenciamento",
    status: "online",
  });
});

app.get("/saude", (_req, res) => {
  res.json({
    ok: true,
    servico: "GACFOOD Licenciamento API",
    ambiente: ambiente.ambienteExecucao,
  });
});

app.use("/api", rotas);

app.use(tratarErros);

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(
    ambiente.porta,
    () => {
      console.log(
        `🚀 GACFOOD Licenciamento API rodando na porta ${ambiente.porta}`
      );
    }
  );
}